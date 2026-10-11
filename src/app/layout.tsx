import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RISE USA — Build What Lasts",
    template: "%s · RISE USA",
  },
  description:
    "RISE USA: Roadmap to Income, Savings, and Equity — a financial-literacy and financial-readiness program for high school juniors and seniors. Start Small. Scale Smart. Stay Consistent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-rise-sky text-rise-navy">
        {children}
      </body>
    </html>
  );
}
