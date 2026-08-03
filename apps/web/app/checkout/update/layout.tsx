import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Payment Method | VibeCheck",
  description: "Update your VibeCheck billing information and payment methods.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
