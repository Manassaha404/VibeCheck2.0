import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Form Draft | VibeCheck",
  description: "Continue building your saved form draft on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
