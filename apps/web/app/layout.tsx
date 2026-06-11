import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "../providers/global";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "VibeCheck — Polls, Quizzes & Forms",
  description:
    "Create polls, quizzes, forms, and petitions. Free, fast, and beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalProviders>
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="top-right" />
        </GlobalProviders>
      </body>
    </html>
  );
}
