import { Router } from "express";
import { oAuthService } from "@repo/trpc/server/services";
import type { Request, Response } from "express";
import {
  generateRefreshToken,
  verifyRefreshToken,
} from "@repo/trpc/server/utils/jwt";
import { env } from "./env";
import logger from "@repo/logger/logger";
const authRouter = Router();

// login/signup
authRouter.get("/google", (req: Request, res: Response) => {
  const returnTo = req.query.returnTo;
  if (returnTo && typeof returnTo === "string" && returnTo.startsWith("/")) {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("loginReturnTo", returnTo, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
  }
  res.redirect(oAuthService.getGoogleAuthUrl());
});

authRouter.get("/google/callback", async (req: Request, res: Response) => {
  const { code, error } = req.query;

  const returnTo = req.cookies?.loginReturnTo;
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("loginReturnTo", {
    path: "/",
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
  });
  const basePath =
    typeof returnTo === "string" && returnTo.startsWith("/") && returnTo !== "/"
      ? returnTo
      : "";

  if (error || !code) {
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/login`);
    redirectUrl.searchParams.set("error", "oauth_cancelled");
    if (basePath) redirectUrl.searchParams.set("returnTo", basePath);
    return res.redirect(redirectUrl.toString());
  }

  try {
    const { access_token, refresh_token } =
      await oAuthService.exchangeCodeForTokens({ code: code as string });

    const googleUser = await oAuthService.getGoogleUserInfo({
      accessToken: access_token,
    });

    if (!googleUser.email_verified) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=email_not_verified`,
      );
    }

    const { userId, isNewUser } = await oAuthService.findOrCreateUser({
      googleUser,
      refreshToken: refresh_token,
    });

    const refreshToken = generateRefreshToken(userId);

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    if (isNewUser) {
      const redirectUrl = new URL(`${env.FRONTEND_URL}/username`);
      if (basePath) redirectUrl.searchParams.set("returnTo", basePath);
      return res.redirect(redirectUrl.toString());
    }

    return res.redirect(`${env.FRONTEND_URL}${basePath}`);
  } catch (err) {
    logger.error("Google OAuth error:", err);
    const redirectUrl = new URL(`${env.FRONTEND_URL}/login`);
    redirectUrl.searchParams.set("error", "server_error");
    if (basePath) redirectUrl.searchParams.set("returnTo", basePath);
    return res.redirect(redirectUrl.toString());
  }
});

//drive
authRouter.get("/google/drive", async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const returnTo = req.query.returnTo;
  if (returnTo && typeof returnTo === "string" && returnTo.startsWith("/")) {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("driveReturnTo", returnTo, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
  }

  try {
    const { userId } = verifyRefreshToken(token);

    // Check if the user has already connected Google Drive
    const isConnected = await oAuthService.isDriveConnected({ userId });
    if (isConnected) {
      const basePath =
        typeof returnTo === "string" && returnTo.startsWith("/")
          ? returnTo
          : "/";
      const redirectUrl = new URL(`${env.FRONTEND_URL}${basePath}`);
      redirectUrl.searchParams.set("info", "drive_already_connected");
      return res.redirect(redirectUrl.toString());
    }

    const redirectUri = `${req.protocol}://${req.get("host")}/auth/google/drive/callback`;
    res.redirect(oAuthService.getGoogleDriveAuthUrl({ redirectUri }));
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

authRouter.get(
  "/google/drive/callback",
  async (req: Request, res: Response) => {
    const { code, error } = req.query;
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.redirect(`${env.FRONTEND_URL}/login?error=unauthorized`);
    }

    const returnTo = req.cookies?.driveReturnTo;
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("driveReturnTo", {
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
    });
    const basePath =
      typeof returnTo === "string" && returnTo.startsWith("/")
        ? returnTo
        : "/settings";

    if (error || !code) {
      const redirectUrl = new URL(`${env.FRONTEND_URL}${basePath}`);
      redirectUrl.searchParams.set("error", "drive_cancelled");
      return res.redirect(redirectUrl.toString());
    }

    try {
      const { userId } = verifyRefreshToken(token);

      const redirectUri = `${req.protocol}://${req.get("host")}/auth/google/drive/callback`;
      const { refresh_token } = await oAuthService.exchangeCodeForDriveTokens({
        code: code as string,
        redirectUri,
      });

      if (refresh_token) {
        await oAuthService.linkDriveToUser({
          userId,
          refreshToken: refresh_token,
        });
      }

      const redirectUrl = new URL(`${env.FRONTEND_URL}${basePath}`);
      redirectUrl.searchParams.set("success", "drive_connected");
      return res.redirect(redirectUrl.toString());
    } catch (err) {
      logger.error("Google Drive OAuth error:", err);
      const redirectUrl = new URL(`${env.FRONTEND_URL}${basePath}`);
      redirectUrl.searchParams.set("error", "server_error");
      return res.redirect(redirectUrl.toString());
    }
  },
);

export default authRouter;
