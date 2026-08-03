import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fill Form | VibeCheck",
  description:
    "Share your feedback and thoughts by filling out this form on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
