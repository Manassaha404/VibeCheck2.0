import { trpc } from "@/trpc/client";
import { useUpdateProfile } from "@/hook/auth/useUpdateProfile";
import { useDriveConnection } from "@/hook/auth/useDriveConnection";

export const useProfileLogic = () => {
  const { data: userData, isLoading: isUserLoading } =
    trpc.auth.getMe.useQuery();
  const {
    data: subData,
    isLoading: isSubLoading,
    refetch: refetchSub,
  } = trpc.subscription.getActiveSubscription.useQuery();
  const { handleUpdateProfile, isUpdatingProfile } = useUpdateProfile();
  const { handleConnectDrive, handleDisconnectDrive, isDisconnecting } =
    useDriveConnection();

  const isLoading = isUserLoading || isSubLoading;

  const onAvatarUpload = async (file: File) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const mockCloudinaryUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${file.name}`;
    await handleUpdateProfile({ avatarUrl: mockCloudinaryUrl });
  };

  const onProfileSubmit = async (data: any) => {
    await handleUpdateProfile(data);
  };

  const onConnectDrive = () => {
    handleConnectDrive();
  };

  return {
    userData,
    isUserLoading,
    isSubLoading,
    isLoading,
    subData,
    refetchSub,
    isUpdatingProfile,
    isDisconnecting,
    handleDisconnectDrive,
    onAvatarUpload,
    onProfileSubmit,
    onConnectDrive,
  };
};
