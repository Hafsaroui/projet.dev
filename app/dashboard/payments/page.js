"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Download, Eye, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-001",
      type: "release",
      amount: 650.0,
      status: "completed",
      date: "2024-01-15",
      order: "ORD-001",
      description: "Vente iPhone 13 Pro",
    },
    {
      id: "TXN-002",
      type: "hold",
      amount: 850.0,
      status: "pending",
      date: "2024-01-14",
      order: "ORD-002",
      description: "Achat MacBook Air M1",
    },
    {
      id: "TXN-003",
      type: "fee",
      amount: -2.5,
      status: "completed",
      date: "2024-01-15",
      order: "ORD-001",
      description: "Frais de service",
    },
  ])

  const getStatusBadge = (status) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    }

    const labels = {
      completed: "Terminé",
      pending: "En attente",
      failed: "Échoué",
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "release":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "hold":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "fee":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-gray-600">Gérez vos transactions et votre solde escrow</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solde disponible</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">1,250.00€</div>
              <p className="text-xs text-muted-foreground">Prêt à être retiré</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En escrow</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">850.00€</div>
              <p className="text-xs text-muted-foreground">En attente de libération</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des ventes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450.00€</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>Toutes vos transactions récentes</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.id}</div>
                        <div className="text-sm text-gray-500">{transaction.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}€
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 