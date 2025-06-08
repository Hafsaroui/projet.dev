import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CreditCard, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

     {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir eCaution ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre système de paiement sécurisé protège acheteurs et vendeurs avec un service d'escrow innovant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Paiement Sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Votre argent est protégé jusqu'à confirmation de réception</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Escrow Automatisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Système de séquestre automatique pour toutes les transactions</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Communauté Vérifiée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Profils vérifiés et système de notation des utilisateurs</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Résolution de Litiges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Mécanisme intégré de résolution des conflits</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Produits Populaires</h2>
            <Link href="/products">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>
          <ProductGrid limit={8} />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Achat</h3>
              <p className="text-sm text-gray-600">L'acheteur effectue le paiement qui est bloqué en escrow</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Envoi</h3>
              <p className="text-sm text-gray-600">Le vendeur envoie le produit avec preuve d'expédition</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Réception</h3>
              <p className="text-sm text-gray-600">L'acheteur confirme la réception du produit</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Paiement</h3>
              <p className="text-sm text-gray-600">L'argent est libéré et transféré au vendeur</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 
