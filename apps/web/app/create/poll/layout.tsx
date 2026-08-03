import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Poll | VibeCheck",
  description: "Quickly build a new poll to gather opinions and feedback.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
