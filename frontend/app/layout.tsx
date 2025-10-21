// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/contexts/Web3Provider"; // Importez le provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bureau des votes",
  description: "Plateforme de vote décentralisée",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}