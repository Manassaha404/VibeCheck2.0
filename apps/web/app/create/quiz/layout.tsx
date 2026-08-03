import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Quiz | VibeCheck",
  description:
    "Design an engaging quiz to test knowledge or entertain your audience.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
