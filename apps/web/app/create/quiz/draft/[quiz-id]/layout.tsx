import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Quiz Draft | VibeCheck",
  description: "Continue editing your saved quiz draft before going live.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
