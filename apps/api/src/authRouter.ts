import { Router } from "express";
import { oAuthService } from "@repo/trpc/server/services";
import type { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@repo/trpc/server/utils/jwt";
import { env } from "./env";
const authRouter = Router();

authRouter.get("/google", (_: Request, res: Response) => {
  res.redirect(oAuthService.getGoogleAuthUrl());
});

authRouter.get("/google/callback", async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=oauth_cancelled`,
    );
  }

  try {
    const { access_token, refresh_token } =
      await oAuthService.exchangeCodeForTokens(code as string);
      
    const googleUser = await oAuthService.getGoogleUserInfo(access_token);

    if (!googleUser.email_verified) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=email_not_verified`,
      );
    }

    const { userId, isNewUser } = await oAuthService.findOrCreateUser(
      googleUser,
      refresh_token,
    );

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
      return res.redirect(`${env.FRONTEND_URL}/username`);
    }

    return res.redirect(`${env.FRONTEND_URL}`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.redirect(`${env.FRONTEND_URL}/login?error=server_error`);
  }
});

export default authRouter;
