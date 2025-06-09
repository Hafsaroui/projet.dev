"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductsTable } from "@/components/products-table"

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mes produits</h1>
            <p className="text-gray-600">Gérez vos annonces et créez-en de nouvelles</p>
          </div>
          <Link href="/sell">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Actives</TabsTrigger>
            <TabsTrigger value="sold">Vendues</TabsTrigger>
            <TabsTrigger value="paused">En pause</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Annonces actives</CardTitle>
                <CardDescription>Vos produits actuellement en vente</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sold">
            <Card>
              <CardHeader>
                <CardTitle>Produits vendus</CardTitle>
                <CardDescription>Historique de vos ventes</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paused">
            <Card>
              <CardHeader>
                <CardTitle>Annonces en pause</CardTitle>
                <CardDescription>Produits temporairement retirés de la vente</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft">
            <Card>
              <CardHeader>
                <CardTitle>Brouillons</CardTitle>
                <CardDescription>Annonces non publiées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucun brouillon pour le moment</p>
                  <Link href="/sell">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une annonce
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 