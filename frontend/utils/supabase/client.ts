import { createBrowserClient } from '@supabase/ssr'

const supabaseUrlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeyEnv = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrlEnv) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseKeyEnv) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
}

const supabaseUrl: string = supabaseUrlEnv
const supabaseKey: string = supabaseKeyEnv

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
