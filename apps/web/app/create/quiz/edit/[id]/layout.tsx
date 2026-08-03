import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Quiz | VibeCheck",
  description: "Modify your existing quiz questions, settings, and structure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
