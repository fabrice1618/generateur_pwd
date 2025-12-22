interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

class ApiCache {
  private cache = new Map<string, CacheEntry>()

  // Nettoyer les entrées expirées
  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Générer une clé unique pour la requête
  private generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET'
    const body = options?.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  // Vérifier si une entrée est valide
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Récupérer une entrée du cache
  get(key: string): any | null {
    if (this.has(key)) {
      return this.cache.get(key)!.data
    }
    return null
  }

  // Stocker une entrée dans le cache
  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  // Supprimer une entrée du cache
  delete(key: string): void {
    this.cache.delete(key)
  }

  // Vider tout le cache
  clear(): void {
    this.cache.clear()
  }

  // Fonction fetch avec cache
  async cachedFetch(url: string, options?: RequestInit, ttl?: number): Promise<Response> {
    this.cleanup()

    const key = this.generateKey(url, options)
    const cached = this.get(key)

    if (cached) {
      // Retourner une Response-like object depuis le cache
      return new Response(JSON.stringify(cached), {
        status: 200,
        statusText: 'OK (cached)',
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await fetch(url, options)
    const responseClone = response.clone()

    if (response.ok) {
      try {
        const data = await responseClone.json()
        this.set(key, data, ttl)
      } catch (e) {
        // Si ce n'est pas du JSON, on ne cache pas
      }
    }

    return response
  }
}

// Instance globale du cache
export const apiCache = new ApiCache()

// Fonction utilitaire pour fetch avec cache
export const cachedFetch = apiCache.cachedFetch.bind(apiCache)

// Hook pour utiliser le cache dans les composants
export const useApiCache = () => {
  return {
    cachedFetch,
    clearCache: apiCache.clear.bind(apiCache),
    hasCache: apiCache.has.bind(apiCache)
  }
}