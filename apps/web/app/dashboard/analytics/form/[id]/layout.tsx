import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Analytics | VibeCheck",
  description:
    "Gain insights and view detailed analytics for your form submissions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
