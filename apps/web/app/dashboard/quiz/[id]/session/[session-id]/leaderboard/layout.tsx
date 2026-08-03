import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Leaderboard | VibeCheck",
  description:
    "View the live leaderboard and top scores for your quiz session.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
