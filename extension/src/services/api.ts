import { useUserStore } from '../stores/user'

const BASE = 'https://example.com/api'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const store = useUserStore()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (store.token) headers['Authorization'] = `Bearer ${store.token}`

  const res = await fetch(BASE + path, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}
