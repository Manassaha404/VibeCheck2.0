import { AppError } from "@repo/error";
import { emailQueue } from "./emailQueue";

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  try {
    await emailQueue.add("verification", { type: "VERIFICATION", email, otp });
  } catch (error) {
    throw new AppError("INTERNAL_SERVER_ERROR", "Failed to enqueue verification email");
  }
};

export const sendPasswordResetEmail = async (email: string, otp: string): Promise<void> => {
  try {
    await emailQueue.add("password_reset", { type: "PASSWORD_RESET", email, otp });
  } catch (error) {
    throw new AppError("INTERNAL_SERVER_ERROR", "Failed to enqueue password reset email");
  }
};
