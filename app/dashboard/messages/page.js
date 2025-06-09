"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare, Send } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversations] = useState([
    {
      id: "1",
      user: "Marie Dupont",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Bonjour, l'iPhone est-il toujours disponible ?",
      time: "Il y a 2h",
      unread: 2,
      product: "iPhone 13 Pro",
    },
    {
      id: "2",
      user: "Pierre Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Merci pour la livraison rapide !",
      time: "Hier",
      unread: 0,
      product: "MacBook Air M1",
    },
    {
      id: "3",
      user: "Sophie Bernard",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Pouvez-vous m'envoyer plus de photos ?",
      time: "Il y a 3j",
      unread: 1,
      product: "Vélo électrique",
    },
  ])

  const [messages] = useState([
    {
      id: "1",
      sender: "Marie Dupont",
      content: "Bonjour, l'iPhone est-il toujours disponible ?",
      time: "14:30",
      isOwn: false,
    },
    {
      id: "2",
      sender: "Vous",
      content: "Bonjour ! Oui, il est toujours disponible. Souhaitez-vous plus d'informations ?",
      time: "14:35",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Marie Dupont",
      content: "Parfait ! L'état de la batterie est-il bon ?",
      time: "14:40",
      isOwn: false,
    },
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Communiquez avec les acheteurs et vendeurs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Rechercher..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                      selectedConversation === conversation.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{conversation.user}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{conversation.product}</p>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone de conversation */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Marie Dupont</CardTitle>
                      <CardDescription>À propos de: iPhone 13 Pro</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-[400px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 py-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Zone de saisie */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Tapez votre message..." className="flex-1" />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 