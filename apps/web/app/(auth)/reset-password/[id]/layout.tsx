import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | VibeCheck",
  description: "Securely reset your VibeCheck account password.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
