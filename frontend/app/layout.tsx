// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/contexts/Web3Provider"; // Importez le provider
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bureau des Votes",
  description: "Plateforme de vote décentralisée",
  keywords: ["vote", "blockchain", "décentralisé"],
  authors: [{ name: "Tendos" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <SpeedInsights />
      <Analytics />
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}