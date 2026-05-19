import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "模拟考试系统",
  description: "在线模拟考试平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn("h-full", "font-sans", notoSans.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
