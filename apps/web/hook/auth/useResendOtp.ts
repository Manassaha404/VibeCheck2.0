import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export const useResendOtp = () => {
  const { mutateAsync: resendOtpMutation, isPending: isResending } = trpc.auth.resendOtp.useMutation();

  const handleResend = async (id: string) => {
    if (!id) return;
    try {
      await resendOtpMutation({ id });
      toast.success("A new OTP has been sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  return { handleResend, isResending };
};
