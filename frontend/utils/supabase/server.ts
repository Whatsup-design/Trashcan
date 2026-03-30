import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

const supabaseUrlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeyEnv = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

type CookieToSet = {
  name: string
  value: string
  options: CookieOptions
}

if (!supabaseUrlEnv) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseKeyEnv) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
}

const supabaseUrl: string = supabaseUrlEnv
const supabaseKey: string = supabaseKeyEnv

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: CookieToSet) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components may not be able to write cookies directly.
        }
      },
    },
  })
}
