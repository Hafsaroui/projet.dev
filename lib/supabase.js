import { createClient } from '@supabase/supabase-js'

// Vérifier si nous sommes dans un environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development'

// URL et clé par défaut pour le développement
const defaultUrl = 'http://localhost:54321'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Utiliser les variables d'environnement ou les valeurs par défaut
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (isDevelopment ? defaultUrl : '')
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isDevelopment ? defaultKey : '')

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}) 