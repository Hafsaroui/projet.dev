import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://urlqrxuqtrtdmjbfkrqj.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVybHFyeHVxdHJ0ZG1qYmZrcnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDE0OTgsImV4cCI6MjA2NDcxNzQ5OH0.3KeTlYRtYc3MvthnvbewurtX5_g9d3zJz4eNkh7aJww"

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
