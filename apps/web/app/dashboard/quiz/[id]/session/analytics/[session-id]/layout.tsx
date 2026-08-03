import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Analytics | VibeCheck",
  description:
    "Analyze participant performance and statistics for your quiz session.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
