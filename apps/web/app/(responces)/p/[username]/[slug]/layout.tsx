import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vote on Poll | VibeCheck",
  description:
    "Cast your vote in this poll and see what others think on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
