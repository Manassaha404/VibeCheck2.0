import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poll Analytics | VibeCheck",
  description: "Track votes and view the results of your published poll.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
