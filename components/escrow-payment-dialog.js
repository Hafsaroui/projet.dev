"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Shield, CheckCircle, Truck, Clock, Info } from "lucide-react"
import { useRouter } from "next/navigation"

export function EscrowPaymentDialog({ open, onOpenChange, product }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
  })
  const router = useRouter()

  const handlePayment = async () => {
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setStep(3)
    setLoading(false)

    // Redirect to order tracking after 2 seconds
    setTimeout(() => {
      onOpenChange(false)
      router.push("/dashboard/orders")
    }, 2000)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Récapitulatif de commande</h3>
        <p className="text-gray-600">Vérifiez les détails avant de procéder au paiement</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold">{product.title}</h4>
              <p className="text-sm text-gray-600">Vendu par {product.seller.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{product.price}€</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Prix du produit</span>
              <span>{product.price}€</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de service eCaution</span>
              <span>2,50€</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{product.price + 2.5}€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Paiement sécurisé :</strong> Votre argent sera bloqué en escrow jusqu'à confirmation de réception du
          produit.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Info className="h-4 w-4" />
          Comment ça marche ?
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-semibold text-xs">
              1
            </div>
            <span>Votre paiement est sécurisé en escrow</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-semibold text-xs">
              2
            </div>
            <span>Le vendeur expédie le produit</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-semibold text-xs">
              3
            </div>
            <span>Vous confirmez la réception</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-600 font-semibold text-xs">
              4
            </div>
            <span>L'argent est libéré au vendeur</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Informations de paiement</h3>
        <p className="text-gray-600">Saisissez vos informations de carte bancaire</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Numéro de carte</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="pl-10"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Date d'expiration</Label>
            <Input
              id="expiryDate"
              placeholder="MM/AA"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nom sur la carte</Label>
          <Input
            id="name"
            placeholder="Jean Dupont"
            value={paymentData.name}
            onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold">Adresse de facturation</h4>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="123 Rue de la Paix"
              value={paymentData.address}
              onChange={(e) => setPaymentData({ ...paymentData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                placeholder="Paris"
                value={paymentData.city}
                onChange={(e) => setPaymentData({ ...paymentData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                placeholder="75001"
                value={paymentData.postalCode}
                onChange={(e) => setPaymentData({ ...paymentData, postalCode: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Vos informations sont chiffrées et sécurisées. Nous ne stockons jamais vos données bancaires.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Paiement confirmé !</h3>
        <p className="text-gray-600">Votre commande a été enregistrée avec succès</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Truck className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">En attente d'expédition</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Clock className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">Redirection vers le suivi de commande...</span>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paiement sécurisé</DialogTitle>
          <DialogDescription>
            {step === 1 && "Vérifiez les détails de votre commande"}
            {step === 2 && "Saisissez vos informations de paiement"}
            {step === 3 && "Confirmation de paiement"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <DialogFooter>
          {step === 1 && (
            <Button onClick={() => setStep(2)} className="w-full">
              Continuer vers le paiement
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handlePayment} className="w-full" disabled={loading}>
              {loading ? "Traitement en cours..." : "Payer maintenant"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
