import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SomethingProvider from "@/app/components/ui/SomethingProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Smart Meeting",
  description: "会議室予約システム",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions)
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}

      >

        <SomethingProvider session={session}>
          {children}
        </SomethingProvider>

      </body>
    </html>
  );
}
