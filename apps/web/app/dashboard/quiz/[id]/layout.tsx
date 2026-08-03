import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Dashboard | VibeCheck",
  description:
    "Manage your quiz settings, questions, and view session history.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
