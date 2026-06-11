import { Queue } from "bullmq";

export type EmailJobData = {
  type: "VERIFICATION" | "PASSWORD_RESET";
  email: string;
  otp: string;
};

export const emailQueue = new Queue<EmailJobData>("email-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
