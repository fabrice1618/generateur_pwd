import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    isLogged: false as boolean,
    isAdmin: false as boolean,
    name: '' as string,
    email: '' as string,
    uuid: '' as string,
    token: '' as string,
    refreshToken: '' as string
  }),
  getters: {
    isTokenValid: (state) => {
      if (!state.token) return false
      try {
        const payload = JSON.parse(atob(state.token.split('.')[1]))
        return payload.exp * 1000 > Date.now()
      } catch {
        return false
      }
    }
  },
  actions: {
    login(payload: { isAdmin?: boolean; name?: string; email?: string; token?: string; refreshToken?: string } = {}) {
      this.isLogged = true
      this.isAdmin = !!payload.isAdmin
      this.name = payload.name || ''
      this.email = payload.email || ''
      this.uuid = payload.uuid || this.generateUUID()
      this.token = payload.token || ''
      this.refreshToken = payload.refreshToken || ''
      localStorage.setItem('user', JSON.stringify({
        isLogged: this.isLogged,
        isAdmin: this.isAdmin,
        name: this.name,
        email: this.email,
        uuid: this.uuid,
        token: this.token,
        refreshToken: this.refreshToken
      }))
    },
    logout() {
      this.isLogged = false
      this.isAdmin = false
      this.name = ''
      this.email = ''
      this.uuid = ''
      this.token = ''
      this.refreshToken = ''
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    setTokens(token: string, refreshToken?: string) {
      this.token = token
      if (refreshToken) this.refreshToken = refreshToken
      localStorage.setItem('token', token)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    },
    sync() {
      // Sync from localStorage
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw)
        this.isLogged = !!u.isLogged
        this.isAdmin = !!u.isAdmin
        this.name = u.name || ''
        this.email = u.email || ''
        this.uuid = u.uuid || ''
        this.token = u.token || ''
        this.refreshToken = u.refreshToken || ''
      }

      // Also check separate token storage
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      if (token) this.token = token
      if (refreshToken) this.refreshToken = refreshToken

      // Validate token
      if (this.token && !this.isTokenValid) {
        this.logout()
      }
    },
    async refreshAccessToken() {
      if (!this.refreshToken) return false

      try {
        // Simulation d'appel API pour refresh
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        })

        if (response.ok) {
          const data = await response.json()
          this.setTokens(data.token, data.refreshToken)
          return true
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
      }

      this.logout()
      return false
    },
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
  }
})
