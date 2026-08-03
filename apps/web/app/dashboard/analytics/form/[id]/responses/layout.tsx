import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Responses | VibeCheck",
  description: "View and manage individual responses submitted to your form.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
