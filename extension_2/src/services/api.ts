import axios from 'axios'
import { cachedFetch } from '../utils/apiCache'
import { useSessionStore } from '../stores/session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const session = useSessionStore()
    if (session.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const session = useSessionStore()

    if (error.response?.status === 401 && session.refreshToken) {
      // Token expiré, essayer de refresh
      const refreshed = await session.refreshAccessToken()
      if (refreshed) {
        // Retry la requête originale avec le nouveau token
        const config = error.config
        config.headers.Authorization = `Bearer ${session.token}`
        return api(config)
      }
    }

    return Promise.reject(error)
  }
)

// Fonction pour les requêtes GET avec cache
export const cachedGet = async (url: string, ttl: number = 300000) => {
  try {
    const fullUrl = `${api.defaults.baseURL}${url}`
    const response = await cachedFetch(fullUrl, {
      method: 'GET',
      headers: api.defaults.headers as Record<string, string>
    }, ttl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Cached GET error:', error)
    // Fallback to regular axios call
    return api.get(url).then(res => res.data)
  }
}

export default api