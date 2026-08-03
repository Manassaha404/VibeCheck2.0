import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify | VibeCheck",
  description:
    "Verify your email address to complete your VibeCheck registration.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
