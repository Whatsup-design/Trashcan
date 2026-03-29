const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export type LoginPayload = {
  loginId: string
  password: string
  rememberMe: boolean
}

export type AuthResponse = {
  success: boolean
  role: 'admin' | 'user' | null
  token?: string
  message?: string
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  return {
    success: Boolean(data.success),
    role: data.role ?? null,
    token: data.token,
    message: data.message,
  }
}

export async function registerApi(payload: {
  username: string
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return res.json()
}

export async function googleLoginApi(): Promise<void> {
  window.location.href = `${BASE_URL}/auth/google`
}
