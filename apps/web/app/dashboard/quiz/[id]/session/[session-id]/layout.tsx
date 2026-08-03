import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Quiz Session | VibeCheck",
  description: "Host and manage your live quiz session in real-time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
