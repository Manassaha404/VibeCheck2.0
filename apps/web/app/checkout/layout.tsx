import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | VibeCheck",
  description: "Complete your subscription upgrade securely on VibeCheck.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
