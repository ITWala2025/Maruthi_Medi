import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Maruthi Medical — Koppa Village Apothecary & Digital Pharmacy",
  description:
    "Dispensing medicine, counsel & quiet reassurance in Koppa Village, Jigani Hobli, Bengaluru 560105. Order prescription and OTC medicines online or via WhatsApp.",
  keywords: [
    "Maruthi Medical",
    "Pharmacy Koppa Village",
    "Chemist Jigani",
    "Medical Store Hulimangala",
    "Anekal Pharmacy",
    "Online Medicine Delivery Koppa",
    "WhatsApp Medicine Order",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full w-full overflow-x-hidden flex flex-col font-sans bg-[#FBF9F5] text-[#18221E]">
        {children}
      </body>
    </html>
  );
}
