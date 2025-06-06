"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, MessageSquare, AlertTriangle } from "lucide-react"

export function OrdersTable() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockOrders = [
      {
        id: "ORD-001",
        product: "iPhone 13 Pro",
        buyer: "Marie D.",
        seller: "Vous",
        amount: 650,
        status: "completed",
        date: "2024-01-15",
        escrowStatus: "released",
      },
      {
        id: "ORD-002",
        product: "MacBook Air M1",
        buyer: "Vous",
        seller: "Pierre L.",
        amount: 850,
        status: "shipped",
        date: "2024-01-14",
        escrowStatus: "held",
      },
      {
        id: "ORD-003",
        product: "Vélo électrique",
        buyer: "Sophie M.",
        seller: "Vous",
        amount: 450,
        status: "pending",
        date: "2024-01-13",
        escrowStatus: "held",
      },
      {
        id: "ORD-004",
        product: "Console PS5",
        buyer: "Vous",
        seller: "Alex R.",
        amount: 400,
        status: "disputed",
        date: "2024-01-12",
        escrowStatus: "disputed",
      },
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      shipped: "default",
      delivered: "secondary",
      completed: "default",
      disputed: "destructive",
    }

    const labels = {
      pending: "En attente",
      shipped: "Expédié",
      delivered: "Livré",
      completed: "Terminé",
      disputed: "Litige",
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getEscrowBadge = (status) => {
    const variants = {
      held: "secondary",
      released: "default",
      disputed: "destructive",
    }

    const labels = {
      held: "Bloqué",
      released: "Libéré",
      disputed: "En litige",
    }

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Commande</TableHead>
          <TableHead>Produit</TableHead>
          <TableHead>Acheteur/Vendeur</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Escrow</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell>
              <div className="text-sm">
                <div>Acheteur: {order.buyer}</div>
                <div className="text-gray-500">Vendeur: {order.seller}</div>
              </div>
            </TableCell>
            <TableCell className="font-semibold">{order.amount}€</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell>{getEscrowBadge(order.escrowStatus)}</TableCell>
            <TableCell>{new Date(order.date).toLocaleDateString("fr-FR")}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contacter
                  </DropdownMenuItem>
                  {order.status === "disputed" && (
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Gérer le litige
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 