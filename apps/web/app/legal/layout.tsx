import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal | VibeCheck",
  description:
    "Read VibeCheck's Terms of Service, Privacy Policy, and Cancellation Policy. We're committed to transparency and protecting your data.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
