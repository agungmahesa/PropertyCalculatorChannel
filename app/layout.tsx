import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProfitStay - Hotel Channel Profitability",
  description: "Maximize your hotel revenue by calculating real profit per channel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${jakarta.variable} font-sans antialiased bg-slate-50 text-slate-900`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
