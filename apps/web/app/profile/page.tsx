"use client";

import { Suspense } from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DriveIntegrationCard } from "@/components/profile/DriveIntegrationCard";
import { useUpdateProfile } from "../../hook/auth/useUpdateProfile";
import { useDriveConnection } from "../../hook/auth/useDriveConnection";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageLoader from "../../components/PageLoader";

const ProfileContent = () => {
  const { data: userData, isLoading: isUserLoading } =
    trpc.auth.getMe.useQuery();
  const { handleUpdateProfile, isUpdatingProfile } = useUpdateProfile();
  const { handleConnectDrive, handleDisconnectDrive, isDisconnecting } =
    useDriveConnection();

  const onAvatarUpload = async (file: File) => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real scenario, we'd use trpc.upload.getSignature to upload to Cloudinary
    // and then pass the resulting URL to updateProfile.
    // For now, we'll just mock it and save a generic placeholder or the object url.

    // Fallback URL simulating an uploaded image
    const mockCloudinaryUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${file.name}`;
    await handleUpdateProfile({ avatarUrl: mockCloudinaryUrl });
  };

  const onProfileSubmit = async (data: any) => {
    await handleUpdateProfile(data);
  };

  const onConnectDrive = () => {
    handleConnectDrive();
  };

  if (isUserLoading || !userData) {
    return <PageLoader />;
  }

  const user = userData.users;
  const isDriveConnected = userData.isGoogleDriveConnected;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <ProfileLayout>
          <div className="bg-[var(--color-surface)] border-4 border-[var(--color-ink-charcoal)] shadow-neubrutalist p-10 mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="stagger-item shrink-0">
                <AvatarUploader
                  currentAvatarUrl={user.avatarUrl}
                  onUpload={onAvatarUpload}
                  isUploading={isUpdatingProfile}
                />
              </div>

              <div className="stagger-item w-full">
                <ProfileForm
                  initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                  }}
                  onSubmit={onProfileSubmit}
                  isLoading={isUpdatingProfile}
                />
              </div>
            </div>
          </div>

          <div className="stagger-item">
            <h2 className="text-headline-md font-display font-black text-[var(--color-ink-charcoal)] mb-6">
              Integrations
            </h2>
            <DriveIntegrationCard
              isConnected={isDriveConnected}
              isConnecting={false}
              isDisconnecting={isDisconnecting}
              onConnect={onConnectDrive}
              onDisconnect={handleDisconnectDrive}
            />
          </div>
        </ProfileLayout>
      </div>
      <Footer />
    </div>
  );
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProfileContent />
    </Suspense>
  );
}
