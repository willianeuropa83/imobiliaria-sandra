import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imobiliária Sandra — Encontre o seu imóvel em Portugal",
  description: "Pesquise milhares de imóveis em Portugal. Apartamentos, moradias, terrenos e mais. Todas as ofertas dos principais portais num só lugar.",
  keywords: "imóveis, casas, apartamentos, Portugal, comprar casa, arrendar, imobiliária",
  openGraph: {
    title: "Imobiliária Sandra",
    description: "Encontre o seu imóvel em Portugal",
    type: "website",
    locale: "pt_PT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
