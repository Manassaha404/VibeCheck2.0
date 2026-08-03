import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Form Response | VibeCheck",
  description:
    "Update your previously submitted form response securely on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
