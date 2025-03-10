import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/common/Navigation";
import InstallPrompt from "../components/installPrompt/InstallPrompt";

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
  icons: {
    icon: [
      {
        url: "/icons/48.png",
        sizes: "48x48",
        type: "image/png"
      },
      {
        url: "/icons/72.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        url: "/icons/96.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        url: "/icons/144.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        url: "/icons/192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        url: "/icons/512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased p-3 flex flex-col min-h-screen`}>
        <main className="flex-1">
          <InstallPrompt />
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
