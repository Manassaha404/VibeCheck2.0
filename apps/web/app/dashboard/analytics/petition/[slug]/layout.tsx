import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petition Analytics | VibeCheck",
  description:
    "Monitor signature growth and analyze the impact of your petition.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
