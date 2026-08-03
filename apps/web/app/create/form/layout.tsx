import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Form | VibeCheck",
  description:
    "Build a custom form to collect detailed feedback and responses.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
