"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // États des filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [location, setLocation] = useState("")

  useEffect(() => {
    // Charger les catégories
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("sort_order", { ascending: true })

      if (data) {
        setCategories(data)
      }
    }

    fetchCategories()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)

    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories:category_id (name),
          users:seller_id (first_name, last_name),
          product_images (image_url, is_primary)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      // Appliquer les filtres
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory)
      }

      if (selectedCondition) {
        query = query.eq("condition", selectedCondition)
      }

      if (priceRange[0] > 0 || priceRange[1] < 2000) {
        query = query.gte("price", priceRange[0]).lte("price", priceRange[1])
      }

      if (location) {
        query = query.ilike("location", `%${location}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error)
        return
      }

      // Formater les données pour l'affichage
      const formattedProducts =
        data?.map((product) => {
          const primaryImage = product.product_images.find((img) => img.is_primary)
          return {
            ...product,
            image:
              primaryImage?.image_url ||
              product.product_images[0]?.image_url ||
              "/placeholder.svg?height=200&width=200",
            categoryName: product.categories?.name || "Non catégorisé",
            sellerName: `${product.users?.first_name || ""} ${product.users?.last_name?.charAt(0) || ""}.`,
          }
        }) || []

      setProducts(formattedProducts)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleFilterChange = () => {
    fetchProducts()
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedCondition("")
    setPriceRange([0, 2000])
    setLocation("")
    setTimeout(() => {
      fetchProducts()
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Explorer les produits</h1>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10 bg-white text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">
              Rechercher
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </form>

          {showFilters && (
            <Card className="p-4 mb-4 bg-white text-gray-900">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value)
                        setTimeout(handleFilterChange, 0)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">État</label>
                    <Select
                      value={selectedCondition}
                      onValueChange={(value) => {
                        setSelectedCondition(value)
                        setTimeout(handleFilterChange, 0)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les états" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les états</SelectItem>
                        <SelectItem value="Neuf">Neuf</SelectItem>
                        <SelectItem value="Comme neuf">Comme neuf</SelectItem>
                        <SelectItem value="Très bon état">Très bon état</SelectItem>
                        <SelectItem value="Bon état">Bon état</SelectItem>
                        <SelectItem value="État correct">État correct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Prix ({priceRange[0]}€ - {priceRange[1]}€)
                    </label>
                    <Slider
                      defaultValue={[0, 2000]}
                      min={0}
                      max={2000}
                      step={50}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value)}
                      onValueCommit={handleFilterChange}
                      className="my-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Localisation</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Ville, code postal..."
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onBlur={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                      <p className="text-2xl font-bold">{product.price}€</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{product.categoryName}</span>
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 