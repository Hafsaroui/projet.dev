"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, BarChart3 } from "lucide-react"
import Image from "next/image"

export function ProductsTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockProducts = [
      {
        id: "PRD-001",
        title: "iPhone 13 Pro - Excellent état",
        price: 650,
        image: "/placeholder.svg?height=60&width=60",
        status: "sold",
        views: 45,
        date: "2024-01-15",
      },
      {
        id: "PRD-002",
        title: "Vélo électrique Decathlon",
        price: 450,
        image: "/placeholder.svg?height=60&width=60",
        status: "active",
        views: 23,
        date: "2024-01-13",
      },
      {
        id: "PRD-003",
        title: "Appareil photo Canon EOS",
        price: 320,
        image: "/placeholder.svg?height=60&width=60",
        status: "active",
        views: 18,
        date: "2024-01-11",
      },
      {
        id: "PRD-004",
        title: "Montre Apple Watch Series 8",
        price: 280,
        image: "/placeholder.svg?height=60&width=60",
        status: "paused",
        views: 12,
        date: "2024-01-10",
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      sold: "secondary",
      paused: "secondary",
    }

    const labels = {
      active: "En ligne",
      sold: "Vendu",
      paused: "En pause",
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produit</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Vues</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div>
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="font-semibold">{product.price}€</TableCell>
            <TableCell>{getStatusBadge(product.status)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4 text-gray-400" />
                <span>{product.views}</span>
              </div>
            </TableCell>
            <TableCell>{new Date(product.date).toLocaleDateString("fr-FR")}</TableCell>
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
                    Voir l'annonce
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistiques
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 