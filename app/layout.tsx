import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/installPrompt/InstallPrompt";
import NavigationWrapper from "@/components/common/NavigationWrapper"; // 클라이언트 전용 네비게이션
import Head from "./head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TODO Hunter : Return of Scroll",
  applicationName: "TODO Hunter",
  description: "A task management app",
  manifest: "/public/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <main className="flex-1 flex flex-col">
          <InstallPrompt />
          {children}
        </main>
        <NavigationWrapper /> {/* 클라이언트 전용 네비게이션 */}
      </body>
    </html>
  );
}
