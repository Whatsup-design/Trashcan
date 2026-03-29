import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL in backend environment variables')
}

const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in backend environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
