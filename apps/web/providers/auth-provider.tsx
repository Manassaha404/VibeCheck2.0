"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";
import { useUserInfoStore } from "@/store/userInfoStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUserInfo, setInitialized } = useUserInfoStore();
  const { data, isLoading, isError } = trpc.auth.getMe.useQuery(undefined, {
    retry: false,
  });
  const { data: subData, isLoading: isSubLoading } =
    trpc.subscription.getActiveSubscription.useQuery(undefined, {
      enabled: !!data?.users?.userId,
      retry: false,
    });

  useEffect(() => {
    if (isLoading || (data?.users?.userId && isSubLoading)) return;
    const publicRoutes = ["/", "/signin", "/forgot-password"];
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/reset-password/") ||
      pathname.startsWith("/f/") ||
      pathname.startsWith("/p/") ||
      pathname.startsWith("/pe/") || 
      pathname.startsWith("/legal");

    if (isError || !data?.users?.userId) {
      setInitialized(true);
      setUserInfo({
        userId: undefined,
        email: undefined,
        fullName: undefined,
        username: undefined,
      });
      if (!isPublicRoute) {
        router.replace("/signin");
      }
      return;
    }
    if (data?.users?.userId) {
      setUserInfo({
        userId: data.users.userId,
        email: data.users.email,
        fullName: data.users.firstName + " " + data.users.lastName,
        username: data.users.username,
        isGoogleDriveConnected: data?.isGoogleDriveConnected,
        avatarUrl: data?.users.avatarUrl,
        plan: subData?.plan ?? null,
      });
      setInitialized(true);

      const isAuthRoute =
        pathname === "/signin" || pathname.startsWith("/signup");

      if (isAuthRoute) {
        router.replace("/");
      }
    }
  }, [
    data,
    isLoading,
    isError,
    pathname,
    router,
    setInitialized,
    setUserInfo,
    subData,
    isSubLoading,
  ]);

  if (
    !useUserInfoStore.getState().isInitialized &&
    (isLoading || isSubLoading)
  ) {
    return <></>;
  }
  return <>{children}</>;
}
