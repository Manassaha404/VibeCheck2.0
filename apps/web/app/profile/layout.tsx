import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile & Settings | VibeCheck",
  description:
    "View and update your account details, preferences, and personal profile on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
