"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersTable } from "@/components/orders-table"

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mes commandes</h1>
          <p className="text-gray-600">Gérez vos achats et ventes</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="buying">Mes achats</TabsTrigger>
            <TabsTrigger value="selling">Mes ventes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les commandes</CardTitle>
                <CardDescription>Historique complet de vos transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buying">
            <Card>
              <CardHeader>
                <CardTitle>Mes achats</CardTitle>
                <CardDescription>Produits que vous avez achetés</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="selling">
            <Card>
              <CardHeader>
                <CardTitle>Mes ventes</CardTitle>
                <CardDescription>Produits que vous avez vendus</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Commandes en attente</CardTitle>
                <CardDescription>Commandes nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 