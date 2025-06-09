"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Shield, Heart, Share2, MessageSquare, Star, Truck, CreditCard } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { EscrowPaymentDialog } from "@/components/escrow-payment-dialog"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  useEffect(() => {
    // Mock product data
    const mockProduct = {
      id: params.id,
      title: "iPhone 13 Pro - Excellent état",
      description: `iPhone 13 Pro en excellent état, utilisé avec précaution pendant 1 an. 
      
Toujours dans sa boîte d'origine avec tous les accessoires :
- Chargeur Lightning
- Écouteurs
- Documentation

L'écran est parfait, aucune rayure. La batterie tient encore très bien (santé à 89%). 

Vendu car je passe sur Android. Possibilité de test avant achat.

N'hésitez pas à me contacter pour plus d'informations !`,
      price: 650,
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
      condition: "Excellent",
      category: "Téléphones",
      location: "Paris, 75001",
      seller: {
        name: "Marie D.",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        reviewCount: 23,
        joinDate: "2023-03-15",
      },
      createdAt: "2024-01-15",
      specifications: {
        Marque: "Apple",
        Modèle: "iPhone 13 Pro",
        Stockage: "128 GB",
        Couleur: "Bleu Alpin",
        "État de la batterie": "89%",
        Garantie: "Expirée",
      },
    }

    setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge className="bg-green-100 text-green-800">{product.condition}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-6">{product.price}€</div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{product.seller.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {product.seller.rating}
                      </div>
                      <span>({product.seller.reviewCount} avis)</span>
                      <span>•</span>
                      <span>Membre depuis {new Date(product.seller.joinDate).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => setShowPaymentDialog(true)}>
                <CreditCard className="h-5 w-5 mr-2" />
                Acheter maintenant - Paiement sécurisé
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoris
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Security Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">Paiement sécurisé</div>
                    <div className="text-sm text-blue-700">
                      Votre argent est protégé jusqu'à confirmation de réception
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-gray-700">{product.description}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spécifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-gray-400" />
                  <div>
                    <div className="font-medium">Livraison standard</div>
                    <div className="text-sm text-gray-600">3-5 jours ouvrés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EscrowPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        product={product}
      />
    </div>
  )
} 