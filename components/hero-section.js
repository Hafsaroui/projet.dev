import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">eCaution</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          La marketplace sécurisée pour vos achats d'occasion avec paiement en escrow
        </p>

        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Rechercher un produit..." className="pl-10 bg-white text-gray-900" />
            </div>
            <Button variant="secondary">Rechercher</Button>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Commencer à vendre
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
              Explorer les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 