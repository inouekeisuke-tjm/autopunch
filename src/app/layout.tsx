import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoJS = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AutoPunch | 勤怠打刻の完全自動化",
  description: "毎日繰り返す勤怠打刻作業をゼロにし、時間を解放する勤怠管理の完全自動化ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoJS.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background-main text-text-primary">
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
