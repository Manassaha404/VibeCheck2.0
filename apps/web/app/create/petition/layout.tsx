import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Petition | VibeCheck",
  description: "Create a new petition to gather support and make an impact.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
