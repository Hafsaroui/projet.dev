"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export function ProductGrid({ limit }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts = [
      {
        id: "1",
        title: "iPhone 13 Pro - Excellent état",
        price: 650,
        image: "/placeholder.svg?height=200&width=200",
        location: "Paris, 75001",
        condition: "Excellent",
        seller: "Marie D.",
        created_at: "2024-01-15",
      },
      {
        id: "2",
        title: "MacBook Air M1 - Comme neuf",
        price: 850,
        image: "/placeholder.svg?height=200&width=200",
        location: "Lyon, 69000",
        condition: "Comme neuf",
        seller: "Pierre L.",
        created_at: "2024-01-14",
      },
      {
        id: "3",
        title: "Vélo électrique Decathlon",
        price: 450,
        image: "/placeholder.svg?height=200&width=200",
        location: "Marseille, 13000",
        condition: "Bon état",
        seller: "Sophie M.",
        created_at: "2024-01-13",
      },
      {
        id: "4",
        title: "Console PS5 + 2 manettes",
        price: 400,
        image: "/placeholder.svg?height=200&width=200",
        location: "Toulouse, 31000",
        condition: "Très bon état",
        seller: "Alex R.",
        created_at: "2024-01-12",
      },
      {
        id: "5",
        title: "Appareil photo Canon EOS",
        price: 320,
        image: "/placeholder.svg?height=200&width=200",
        location: "Nice, 06000",
        condition: "Bon état",
        seller: "Julie B.",
        created_at: "2024-01-11",
      },
      {
        id: "6",
        title: "Montre Apple Watch Series 8",
        price: 280,
        image: "/placeholder.svg?height=200&width=200",
        location: "Nantes, 44000",
        condition: "Excellent",
        seller: "Thomas K.",
        created_at: "2024-01-10",
      },
      {
        id: "7",
        title: "Tablette iPad Pro 11 pouces",
        price: 520,
        image: "/placeholder.svg?height=200&width=200",
        location: "Strasbourg, 67000",
        condition: "Comme neuf",
        seller: "Emma F.",
        created_at: "2024-01-09",
      },
      {
        id: "8",
        title: "Casque audio Bose QuietComfort",
        price: 180,
        image: "/placeholder.svg?height=200&width=200",
        location: "Bordeaux, 33000",
        condition: "Très bon état",
        seller: "Lucas G.",
        created_at: "2024-01-08",
      },
    ]

    setTimeout(() => {
      setProducts(limit ? mockProducts.slice(0, limit) : mockProducts)
      setLoading(false)
    }, 1000)
  }, [limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit || 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="p-0">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="p-0 relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
            <Badge className="absolute top-2 left-2 bg-green-600">{product.condition}</Badge>
          </CardHeader>

          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">{product.price}€</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {product.location}
            </div>
            <p className="text-xs text-gray-400">Par {product.seller}</p>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Link href={`/products/${product.id}`} className="w-full">
              <Button className="w-full" size="sm">
                Voir le produit
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 