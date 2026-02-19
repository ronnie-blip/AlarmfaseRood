import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: {
    default: "Alarmfase Rood",
    template: "%s | Alarmfase Rood",
  },
  description:
    "Alarmfase Rood is de podcast waar de pieper afgaat en het echte verhaal begint. Echte verhalen achter de sirenes.",
  metadataBase: new URL("https://www.alarmfaserood.nl"),
  openGraph: {
    type: "website",
    siteName: "Alarmfase Rood",
    title: "Alarmfase Rood",
    description: "Echte verhalen achter de sirenes.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Alarmfase Rood podcast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alarmfase Rood",
    description: "Echte verhalen achter de sirenes.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="bg-bg text-text antialiased">
        {/* ✅ NAVIGATIEBALK */}
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
