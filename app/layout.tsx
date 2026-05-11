import type { Metadata } from "next";
import { JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import FloatingMath from "@/components/FloatingMath";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuantTec — Tec de Monterrey, Campus Querétaro",
  description:
    "The first quant student club at Tec de Monterrey, Campus Querétaro. A community for students curious about where markets, data, and mathematics meet.",
  openGraph: {
    title: "QuantTec · QRO Campus",
    description:
      "Apply to the founding cohort of QuantTec — the first quant student group at Tec de Monterrey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} ${dmSerifDisplay.variable} font-mono antialiased bg-white text-slate-900`}
      >
        <FloatingMath />
        {children}
      </body>
    </html>
  );
}
