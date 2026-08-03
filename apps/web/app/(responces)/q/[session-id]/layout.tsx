import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Quiz | VibeCheck",
  description:
    "Participate in a live quiz session on VibeCheck and test your knowledge.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
