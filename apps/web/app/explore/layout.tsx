import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Public Polls & Quizzes | VibeCheck",
  description:
    "Discover trending polls, interactive quizzes, active petitions, and public feedback forms on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
