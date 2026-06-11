import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useVerifySignUpOtp = () => {
  const router = useRouter();
  const { mutateAsync: verifyOtpMutation, isPending } = trpc.auth.verifySignUpOtp.useMutation();

  const handleVerify = async (id: string, otp: string) => {
    if (otp.length < 6) return;
    try {
      await verifyOtpMutation({ id, otp });
      toast.success("Verification successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    }
  };

  return { handleVerify, isPending };
};
