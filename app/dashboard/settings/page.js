"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Camera } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "06 12 34 56 78",
    address: "123 Rue de la Paix, 75001 Paris",
  })

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailMessages: true,
    emailMarketing: false,
    smsOrders: true,
    smsMessages: false,
    pushNotifications: true,
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-gray-600">Gérez votre compte et vos préférences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo de profil */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Changer la photo
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG max 2MB</p>
                  </div>
                </div>

                {/* Informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>

                <Button>Sauvegarder les modifications</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notifications par email</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Commandes</Label>
                        <p className="text-sm text-gray-500">Notifications sur vos achats et ventes</p>
                      </div>
                      <Switch
                        checked={notifications.emailOrders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOrders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Messages</Label>
                        <p className="text-sm text-gray-500">Nouveaux messages des autres utilisateurs</p>
                      </div>
                      <Switch
                        checked={notifications.emailMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailMessages: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing</Label>
                        <p className="text-sm text-gray-500">Offres spéciales et nouveautés</p>
                      </div>
                      <Switch
                        checked={notifications.emailMarketing}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailMarketing: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notifications SMS</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Commandes urgentes</Label>
                        <p className="text-sm text-gray-500">Alertes importantes sur vos transactions</p>
                      </div>
                      <Switch
                        checked={notifications.smsOrders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, smsOrders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Messages</Label>
                        <p className="text-sm text-gray-500">Nouveaux messages importants</p>
                      </div>
                      <Switch
                        checked={notifications.smsMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, smsMessages: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Button>Sauvegarder les préférences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>Protégez votre compte avec ces paramètres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">Sécurisez votre compte avec un code SMS</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Désactivé</Badge>
                      <Button variant="outline" size="sm">
                        Activer
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vérification d'identité</Label>
                      <p className="text-sm text-gray-500">Vérifiez votre identité pour augmenter la confiance</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Non vérifié</Badge>
                      <Button variant="outline" size="sm">
                        Vérifier
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                  <CardDescription>Mettez à jour votre mot de passe régulièrement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Changer le mot de passe</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supprimer le compte</CardTitle>
                  <CardDescription>Cette action est irréversible</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Supprimer mon compte</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>Gérez vos cartes de crédit et autres méthodes de paiement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expire 12/24</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Supprimer
                  </Button>
                </div>

                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ajouter une carte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 
