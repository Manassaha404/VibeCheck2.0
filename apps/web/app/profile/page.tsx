"use client";

import { Suspense } from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DriveIntegrationCard } from "@/components/profile/DriveIntegrationCard";
import { SubscriptionCard } from "@/components/profile/SubscriptionCard";
import { useProfileLogic } from "../../hook/profile/useProfileLogic";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageLoader from "../../components/PageLoader";

const ProfileContent = () => {
  const {
    userData,
    isLoading,
    subData,
    refetchSub,
    isUpdatingProfile,
    isDisconnecting,
    handleDisconnectDrive,
    onAvatarUpload,
    onProfileSubmit,
    onConnectDrive,
  } = useProfileLogic();

  if (isLoading || !userData) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <Footer />
      </>
    );
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

          <div className="stagger-item mb-12">
            <h2 className="text-headline-md font-display font-black text-[var(--color-ink-charcoal)] mb-6">
              Subscription & Billing
            </h2>
            {subData?.plan && (
              <SubscriptionCard
                plan={subData.plan}
                razorpaySubscriptionId={
                  subData.subscription?.razorpaySubscriptionId
                }
                status={subData.subscription?.status}
                cancelAtCycleEnd={subData.subscription?.cancelAtCycleEnd}
                scheduledCancellationDate={
                  subData.subscription?.scheduledCancellationDate
                }
                currentEnd={subData.subscription?.currentEnd}
                onCancelled={() => refetchSub()}
              />
            )}
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
    <Suspense
      fallback={
        <>
          <Navbar />
          <PageLoader />
          <Footer />
        </>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
