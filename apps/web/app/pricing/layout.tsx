import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | VibeCheck",
  description:
    "Explore flexible pricing plans for VibeCheck. Choose the right tier for your polling, quiz, and feedback form needs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
