import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
