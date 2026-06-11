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
  useEffect(() => {
    if (isLoading) return;
    const publicRoutes = ["/", "/signin", "/signup", "/forgot-password"];
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith("/signup/verify/") ||
      pathname.startsWith("/reset-password/")

    if (isError || !data?.user?.userId) {
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
    if (data?.user?.userId) {
      setUserInfo({
        userId: data.user.userId,
        email: data.user.email,
        fullName: data.user.firstName + " " + data.user.lastName,
        username: data.user.username,
      });
      setInitialized(true);
    }
  }, [data, isLoading, isError, pathname, router, setInitialized, setUserInfo]);

  if (!useUserInfoStore.getState().isInitialized && isLoading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}
