import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Petition | VibeCheck",
  description:
    "Support and sign this petition on VibeCheck to make your voice heard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
