import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "eCaution - Marketplace sécurisée avec paiement escrow",
  description:
    "Achetez et vendez en toute sécurité avec notre système de paiement en escrow. Protection garantie pour acheteurs et vendeurs.",
  keywords: "marketplace, escrow, paiement sécurisé, occasion, vente, achat",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
} 