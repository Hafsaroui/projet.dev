import { supabase } from "./supabase"

// Fonction pour hasher les mots de passe via l'API
async function hashPassword(password) {
  try {
    const response = await fetch('/api/auth/hash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors du hachage du mot de passe')
    }

    return response.json()
  } catch (error) {
    console.error('Erreur de hachage:', error)
    throw new Error('Erreur lors du hachage du mot de passe')
  }
}

async function verifyPassword(password, hash, salt) {
  try {
    const response = await fetch('/api/auth/hash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du mot de passe')
    }

    const { hash: verifyHash } = await response.json()
    return verifyHash === hash
  } catch (error) {
    console.error('Erreur de vérification:', error)
    return false
  }
}

class AuthService {
  // Inscription d'un nouvel utilisateur
  static async signUp(userData) {
    try {
      if (!supabase) {
        throw new Error('Client Supabase non initialisé')
      }

      // Vérifier si l'email existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userData.email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification de l'email:", checkError)
        return { error: "Erreur lors de la vérification de l'email" }
      }

      if (existingUser) {
        return { error: "Un compte avec cet email existe déjà" }
      }

      // Hasher le mot de passe
      const { hash, salt } = await hashPassword(userData.password)

      // Insérer le nouvel utilisateur
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          email: userData.email,
          password_hash: hash,
          salt: salt,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || null,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Erreur lors de la création de l'utilisateur:", insertError)
        return { error: "Erreur lors de la création du compte" }
      }

      // Envoyer un code de vérification email
      await this.sendVerificationCode(newUser.id, userData.email, "email_verification")

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          phone: newUser.phone,
          avatar_url: newUser.avatar_url,
          is_verified: newUser.is_verified,
          rating: newUser.rating,
          review_count: newUser.review_count,
        },
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      return { error: "Erreur lors de la création du compte" }
    }
  }

  // Connexion d'un utilisateur
  static async signIn(email, password) {
    try {
      // Récupérer l'utilisateur par email
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .is("deleted_at", null)
        .single()

      if (error || !user) {
        await this.logLoginAttempt(email, false, "user_not_found")
        return { error: "Email ou mot de passe incorrect" }
      }

      // Vérifier si le compte est verrouillé
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return { error: "Compte temporairement verrouillé. Réessayez plus tard." }
      }

      // Vérifier le mot de passe
      const isPasswordValid = await verifyPassword(password, user.password_hash, user.salt)

      if (!isPasswordValid) {
        // Incrémenter les tentatives échouées
        const failedAttempts = user.failed_login_attempts + 1
        const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null

        await supabase
          .from("users")
          .update({
            failed_login_attempts: failedAttempts,
            locked_until: lockUntil?.toISOString() || null,
          })
          .eq("id", user.id)

        await this.logLoginAttempt(email, false, "invalid_password")
        return { error: "Email ou mot de passe incorrect" }
      }

      // Connexion réussie
      await supabase
        .from("users")
        .update({
          failed_login_attempts: 0,
          locked_until: null,
          last_login_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      await this.logLoginAttempt(email, true)

      // Diffuser un événement pour informer les autres composants
      if (typeof window !== "undefined" && !error) {
        window.dispatchEvent(new Event("authChange"))
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          avatar_url: user.avatar_url,
          is_verified: user.is_verified,
          rating: user.rating,
          review_count: user.review_count,
        },
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      return { error: "Erreur lors de la connexion" }
    }
  }

  // Envoyer un code de vérification
  static async sendVerificationCode(userId, emailOrPhone, type) {
    try {
      // Générer un code à 6 chiffres
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      // Insérer le code de vérification
      const { error } = await supabase.from("verification_codes").insert({
        user_id: userId,
        email: type.includes("email") ? emailOrPhone : null,
        phone: type.includes("phone") ? emailOrPhone : null,
        code: code,
        type: type,
        expires_at: expiresAt.toISOString(),
      })

      if (error) {
        console.error("Erreur lors de la création du code:", error)
        return false
      }

      // Simuler l'envoi d'email (en réalité, vous utiliseriez un service d'email)
      console.log(`Code de vérification ${type}: ${code} pour ${emailOrPhone}`)

      return true
    } catch (error) {
      console.error("Erreur lors de l'envoi du code:", error)
      return false
    }
  }

  // Vérifier un code de vérification
  static async verifyCode(userId, code, type) {
    try {
      // Récupérer le code de vérification
      const { data: verificationCode, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", userId)
        .eq("code", code)
        .eq("type", type)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error || !verificationCode) {
        return false
      }

      // Marquer le code comme utilisé
      await supabase
        .from("verification_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("id", verificationCode.id)

      // Mettre à jour le statut de vérification de l'utilisateur
      if (type === "email_verification") {
        await supabase
          .from("users")
          .update({
            is_verified: true,
            email_verified_at: new Date().toISOString(),
          })
          .eq("id", userId)
      } else if (type === "phone_verification") {
        await supabase
          .from("users")
          .update({
            phone_verified_at: new Date().toISOString(),
          })
          .eq("id", userId)
      }

      return true
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error)
      return false
    }
  }

  // Logger les tentatives de connexion
  static async logLoginAttempt(email, success, reason = null) {
    try {
      await supabase.from("login_attempts").insert({
        email,
        success,
        reason,
        ip_address: null, // À implémenter avec un middleware
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : null,
      })
    } catch (error) {
      console.error("Erreur lors du logging de la tentative de connexion:", error)
    }
  }

  // Récupérer l'utilisateur courant (exemple simplifié)
  static async getCurrentUser() {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  // Déconnexion
  static async signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("authChange"))
    }
  }
}

export { AuthService } 
