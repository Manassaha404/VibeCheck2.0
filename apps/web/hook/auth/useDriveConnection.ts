import { useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export const useDriveConnection = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const pathname = usePathname();

  const { mutateAsync: disconnectDriveMutation, isPending: isDisconnecting } =
    trpc.auth.disconnectGoogleDrive.useMutation();

  const handleConnectDrive = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/trpc", "") || "";
    window.location.href = `${apiUrl}/auth/google/drive?returnTo=${pathname}`;
  };

  const handleDisconnectDrive = async () => {
    setApiError(null);
    try {
      await disconnectDriveMutation();
      await utils.auth.getMe.invalidate();
      toast.success("Google Drive disconnected successfully");
    } catch (error: any) {
      setApiError(error.message || "Failed to disconnect Google Drive.");
      toast.error("Failed to disconnect from Google Drive");
    }
  };

  return {
    handleConnectDrive,
    handleDisconnectDrive,
    isDisconnecting,
    apiError,
  };
};
