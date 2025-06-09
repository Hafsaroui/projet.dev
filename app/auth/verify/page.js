"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Mail, Loader2, RefreshCw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function VerifyPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    if (!email) {
      router.push("/auth/login")
    }
  }, [email, router])

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Récupérer l'utilisateur par email pour obtenir l'ID
      const { data: user } = await supabase.from("users").select("id").eq("email", email).single()

      if (!user) {
        setError("Utilisateur non trouvé")
        setLoading(false)
        return
      }

      const isValid = await AuthService.verifyCode(user.id, code, "email_verification")

      if (isValid) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/login?verified=true")
        }, 2000)
      } else {
        setError("Code de vérification invalide ou expiré")
      }
    } catch (err) {
      setError("Erreur lors de la vérification")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResending(true)
    setError("")

    try {
      const { data: user } = await supabase.from("users").select("id").eq("email", email).single()

      if (user) {
        await AuthService.sendVerificationCode(user.id, email, "email_verification")
        setError("") // Clear any previous errors
        // Show success message briefly
        setError("Code renvoyé avec succès !")
        setTimeout(() => setError(""), 3000)
      }
    } catch (err) {
      setError("Erreur lors du renvoi du code")
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Email vérifié !</CardTitle>
            <CardDescription>
              Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">Redirection vers la page de connexion...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
          <CardDescription>
            Nous avons envoyé un code de vérification à <strong>{email}</strong>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant={error.includes("succès") ? "default" : "destructive"}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                id="code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 text-center">Saisissez le code à 6 chiffres reçu par email</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Vous n'avez pas reçu le code ?</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={resending}
                className="w-full"
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Renvoyer le code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
} 