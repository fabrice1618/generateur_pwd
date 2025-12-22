import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogged: false as boolean,
    isAdmin: false as boolean,
    name: '' as string
  }),
  actions: {
    login(payload: { isAdmin?: boolean; name?: string } = {}) {
      this.isLogged = true
      this.isAdmin = !!payload.isAdmin
      this.name = payload.name || ''
      localStorage.setItem('user', JSON.stringify({ isLogged: this.isLogged, isAdmin: this.isAdmin, name: this.name }))
    },
    logout() {
      this.isLogged = false
      this.isAdmin = false
      this.name = ''
      localStorage.removeItem('user')
    },
    sync() {
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw)
        this.isLogged = !!u.isLogged
        this.isAdmin = !!u.isAdmin
        this.name = u.name || ''
      }
    }
  }
})
