import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Poll Draft | VibeCheck",
  description: "Continue editing your saved poll draft before publishing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
