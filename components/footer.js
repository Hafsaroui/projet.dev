import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">eCaution</h3>
            <p className="text-gray-300 text-sm">
              La marketplace sécurisée pour vos achats d'occasion avec notre système de paiement en escrow innovant.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Liens rapides</h4>
            <div className="space-y-2 text-sm">
              <Link href="/products" className="block text-gray-300 hover:text-white">
                Explorer les produits
              </Link>
              <Link href="/sell" className="block text-gray-300 hover:text-white">
                Vendre un produit
              </Link>
              <Link href="/how-it-works" className="block text-gray-300 hover:text-white">
                Comment ça marche
              </Link>
              <Link href="/security" className="block text-gray-300 hover:text-white">
                Sécurité
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block text-gray-300 hover:text-white">
                Centre d'aide
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white">
                Nous contacter
              </Link>
              <Link href="/disputes" className="block text-gray-300 hover:text-white">
                Résolution de litiges
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-white">
                Politique de confidentialité
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@ecaution.fr</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-2">
              <h5 className="font-medium">Newsletter</h5>
              <div className="flex space-x-2">
                <Input
                  placeholder="Votre email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button size="sm">S'abonner</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 eCaution. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white">
              Mentions légales
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 