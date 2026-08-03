import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | VibeCheck",
  description:
    "Recover access to your VibeCheck account by requesting a password reset link.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
