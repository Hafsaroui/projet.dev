import { supabase } from "./supabase"

export class ProductService {
  // Récupérer tous les produits avec pagination
  static async getProducts(options = {}) {
    try {
      const { page = 1, limit = 20, category, search, condition, minPrice, maxPrice, location } = options

      let query = supabase.from("product_details").select("*", { count: "exact" }).eq("status", "active")

      // Filtres
      if (category) {
        query = query.eq("category_slug", category)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
      }

      if (condition) {
        query = query.eq("condition", condition)
      }

      if (minPrice !== undefined) {
        query = query.gte("price", minPrice)
      }

      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice)
      }

      if (location) {
        query = query.ilike("location", `%${location}%`)
      }

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

      if (error) {
        console.error("Erreur lors de la récupération des produits:", error)
        return { products: [], total: 0 }
      }

      return {
        products: data || [],
        total: count || 0,
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error)
      return { products: [], total: 0 }
    }
  }

  // Récupérer un produit par ID
  static async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from("product_details")
        .select("*")
        .eq("id", id)
        .eq("status", "active")
        .single()

      if (error) {
        console.error("Erreur lors de la récupération du produit:", error)
        return null
      }

      // Incrémenter le compteur de vues
      await supabase
        .from("products")
        .update({ view_count: data.view_count + 1 })
        .eq("id", id)

      return data
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error)
      return null
    }
  }

  // Récupérer les images d'un produit
  static async getProductImages(productId) {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true })

      if (error) {
        console.error("Erreur lors de la récupération des images:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des images:", error)
      return []
    }
  }

  // Créer un nouveau produit
  static async createProduct(productData, images) {
    try {
      // Insérer le produit
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single()

      if (productError) {
        console.error("Erreur lors de la création du produit:", productError)
        return { error: "Erreur lors de la création du produit" }
      }

      // Insérer les images
      if (images.length > 0) {
        const imageInserts = images.map((img, index) => ({
          product_id: product.id,
          image_url: img.url,
          is_primary: img.isMain,
          sort_order: index,
        }))

        const { error: imagesError } = await supabase.from("product_images").insert(imageInserts)

        if (imagesError) {
          console.error("Erreur lors de l'ajout des images:", imagesError)
          // Ne pas échouer complètement si les images ne s'ajoutent pas
        }
      }

      return { product }
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error)
      return { error: "Erreur lors de la création du produit" }
    }
  }

  // Mettre à jour un produit
  static async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Erreur lors de la mise à jour du produit:", error)
        return { error: "Erreur lors de la mise à jour du produit" }
      }

      return { product: data }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error)
      return { error: "Erreur lors de la mise à jour du produit" }
    }
  }

  // Supprimer un produit (soft delete)
  static async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          status: "deleted",
          deleted_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        console.error("Erreur lors de la suppression du produit:", error)
        return { success: false, error: "Erreur lors de la suppression du produit" }
      }

      return { success: true }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error)
      return { success: false, error: "Erreur lors de la suppression du produit" }
    }
  }

  // Récupérer les produits d'un vendeur
  static async getSellerProducts(sellerId) {
    try {
      const { data, error } = await supabase
        .from("product_details")
        .select("*")
        .eq("seller_id", sellerId)
        .in("status", ["active", "paused"])
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des produits du vendeur:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des produits du vendeur:", error)
      return []
    }
  }

  // Récupérer les catégories
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (error) {
        console.error("Erreur lors de la récupération des catégories:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error)
      return []
    }
  }

  // Ajouter/retirer des favoris
  static async toggleFavorite(userId, productId) {
    try {
      // À implémenter selon la logique réelle
      return true
    } catch (error) {
      console.error("Erreur lors du toggle favori:", error)
      return false
    }
  }
} 