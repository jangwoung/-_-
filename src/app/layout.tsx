import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const zenMaruGodhic = localFont({
  src: "./fonts/Zen_Maru_Gothic/ZenMaruGothic-Regular.ttf",
  variable: "--font-geist-sans",
  weight: "100 200 300 400 500 600",
});

export const metadata: Metadata = {
  title: "市か区",
  description: "私は「市か区」の観光大臣！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body
        className={`${zenMaruGodhic.className} antialiased bg-green-dark sm:file:bg-beige text-base-black flex justify-center`}
      >
        <div className="w-screen min-h-svh sm:w-[420px] sm:min-h-screen bg-green-light">
          {children}
        </div>
      </body>
    </html>
  );
}
