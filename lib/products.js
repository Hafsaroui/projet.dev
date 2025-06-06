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
