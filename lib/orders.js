import { supabase } from "./supabase"

export class OrderService {
  // Créer une nouvelle commande
  static async createOrder(orderData) {
    try {
      const serviceFee = 2.5
      const totalAmount = orderData.productPrice + (orderData.shippingCost || 0) + serviceFee

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          buyer_id: orderData.buyerId,
          seller_id: orderData.sellerId,
          product_id: orderData.productId,
          product_price: orderData.productPrice,
          service_fee: serviceFee,
          shipping_cost: orderData.shippingCost || 0,
          total_amount: totalAmount,
          shipping_address: orderData.shippingAddress,
          billing_address: orderData.billingAddress,
          payment_method: orderData.paymentMethod,
          status: "pending",
          escrow_status: "held",
        })
        .select()
        .single()

      if (error) {
        console.error("Erreur lors de la création de la commande:", error)
        return { error: "Erreur lors de la création de la commande" }
      }

      // Créer l'enregistrement de vérification de livraison
      await supabase.from("delivery_verifications").insert({
        order_id: order.id,
        expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 jours
      })

      // Créer la transaction escrow
      await supabase.from("escrow_transactions").insert({
        order_id: order.id,
        transaction_type: "hold",
        amount: totalAmount,
        net_amount: totalAmount,
        status: "completed",
        reason: "Paiement initial - fonds bloqués en escrow",
        processed_at: new Date().toISOString(),
      })

      // Marquer le produit comme vendu
      await supabase.from("products").update({ status: "sold" }).eq("id", orderData.productId)

      // Envoyer des notifications
      await this.sendOrderNotifications(order)

      return { order }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      return { error: "Erreur lors de la création de la commande" }
    }
  }

  // Récupérer les commandes d'un utilisateur
  static async getUserOrders(userId, type = "all") {
    try {
      let query = supabase.from("order_details").select("*")

      if (type === "buyer") {
        query = query.eq("buyer_id", userId)
      } else if (type === "seller") {
        query = query.eq("seller_id", userId)
      } else {
        query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des commandes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error)
      return []
    }
  }

  // Récupérer une commande par ID
  static async getOrderById(orderId) {
    try {
      const { data, error } = await supabase.from("order_details").select("*").eq("id", orderId).single()

      if (error) {
        console.error("Erreur lors de la récupération de la commande:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error)
      return null
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(orderId, status, escrowStatus) {
    try {
      const updates = { status }

      if (escrowStatus) {
        updates.escrow_status = escrowStatus
      }

      // Ajouter les timestamps appropriés
      if (status === "paid") {
        updates.paid_at = new Date().toISOString()
      } else if (status === "confirmed") {
        updates.confirmed_at = new Date().toISOString()
      } else if (status === "shipped") {
        updates.shipped_at = new Date().toISOString()
      } else if (status === "delivered") {
        updates.delivered_at = new Date().toISOString()
      } else if (status === "completed") {
        updates.completed_at = new Date().toISOString()
      } else if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString()
      }

      const { error } = await supabase.from("orders").update(updates).eq("id", orderId)

      if (error) {
        console.error("Erreur lors de la mise à jour de la commande:", error)
        return { success: false, error: "Erreur lors de la mise à jour de la commande" }
      }

      return { success: true }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error)
      return { success: false, error: "Erreur lors de la mise à jour de la commande" }
    }
  }

  // Confirmer l'expédition par le vendeur
  static async confirmShipment(orderId, trackingData) {
    try {
      // Mettre à jour la commande
      await this.updateOrderStatus(orderId, "shipped")

      // Mettre à jour la vérification de livraison
      const { error } = await supabase
        .from("delivery_verifications")
        .update({
          tracking_number: trackingData.trackingNumber,
          carrier: trackingData.carrier,
          seller_proof_type: trackingData.proofType,
          seller_proof_data: trackingData.proofData,
          seller_proof_submitted_at: new Date().toISOString(),
          verification_status: "shipped",
        })
        .eq("order_id", orderId)

      if (error) {
        console.error("Erreur lors de la confirmation d'expédition:", error)
        return { success: false, error: "Erreur lors de la confirmation d'expédition" }
      }

      // Envoyer une notification à l'acheteur
      const order = await this.getOrderById(orderId)
      if (order) {
        await supabase.from("notifications").insert({
          user_id: order.buyer_id,
          type: "order_shipped",
          title: "Commande expédiée",
          message: `Votre commande ${order.order_number} a été expédiée${trackingData.trackingNumber ? ` avec le numéro de suivi ${trackingData.trackingNumber}` : ''}.`,
          related_entity_type: "order",
          related_entity_id: orderId,
          data: { tracking_number: trackingData.trackingNumber, carrier: trackingData.carrier },
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Erreur lors de la confirmation d'expédition:", error)
      return { success: false, error: "Erreur lors de la confirmation d'expédition" }
    }
  }

  // Confirmer la réception par l'acheteur
  static async confirmDelivery(orderId, confirmationData) {
    try {
      // Mettre à jour la commande
      await this.updateOrderStatus(orderId, "completed", "released")

      // Mettre à jour la vérification de livraison
      await supabase
        .from("delivery_verifications")
        .update({
          buyer_confirmation_type: confirmationData.confirmationType,
          buyer_confirmation_data: confirmationData.confirmationData,
          buyer_confirmed_at: new Date().toISOString(),
          verification_status: "confirmed",
        })
        .eq("order_id", orderId)

      // Créer la transaction de libération des fonds
      const order = await this.getOrderById(orderId)
      if (order) {
        await supabase.from("escrow_transactions").insert({
          order_id: orderId,
          transaction_type: "release",
          amount: order.product_price,
          net_amount: order.product_price,
          status: "completed",
          reason: "Libération des fonds - livraison confirmée par l'acheteur",
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Erreur lors de la confirmation de la livraison:", error)
      return { success: false, error: "Erreur lors de la confirmation de la livraison" }
    }
  }

  // Envoyer des notifications de commande (implémentation fictive)
  static async sendOrderNotifications(order) {
    // À implémenter selon la logique de notification réelle
    console.log("Notification envoyée pour la commande:", order.id)
  }

  // Statistiques de commandes (exemple simplifié)
  static async getOrderStats(userId) {
    // À implémenter selon la logique réelle
    return {
      totalSales: 0,
      totalPurchases: 0,
      pendingOrders: 0,
      escrowBalance: 0,
    }
  }
} 