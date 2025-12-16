import { defineStore } from 'pinia'

type UserProfile = { email: string }

function makeToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function readUsers(): Record<string, { password: string; token?: string }> {
  try {
    const v = localStorage.getItem('users')
    return v ? JSON.parse(v) : {}
  } catch (e) {
    return {}
  }
}

function writeUsers(u: Record<string, { password: string; token?: string }>) {
  try {
    localStorage.setItem('users', JSON.stringify(u))
  } catch (e) {}
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false as boolean,
    token: null as string | null,
    profile: null as UserProfile | null,
  }),
  actions: {
    // login using existing token (used during restore)
    loginWithToken(token: string, profile?: UserProfile) {
      this.token = token
      this.profile = profile ?? null
      this.isAuthenticated = true
      try { localStorage.setItem('user_token', token); if (this.profile) localStorage.setItem('user_profile', JSON.stringify(this.profile)) } catch (e) {}
    },

    // register a new user (returns token)
    register(email: string, password: string) {
      const users = readUsers()
      if (users[email]) throw new Error('Email already registered')
      const token = makeToken()
      users[email] = { password, token }
      writeUsers(users)
      this.loginWithToken(token, { email })
      return token
    },

    // login with email/password
    login(email: string, password: string) {
      const users = readUsers()
      const entry = users[email]
      if (!entry || entry.password !== password) throw new Error('Invalid credentials')
      // use stored token or make one
      const token = entry.token || makeToken()
      entry.token = token
      writeUsers(users)
      this.loginWithToken(token, { email })
      return token
    },

    logout() {
      this.token = null
      this.isAuthenticated = false
      this.profile = null
      try { localStorage.removeItem('user_token'); localStorage.removeItem('user_profile') } catch (e) {}
    },

    restoreFromStorage() {
      try {
        const t = localStorage.getItem('user_token')
        const p = localStorage.getItem('user_profile')
        if (t) {
          this.token = t
          this.isAuthenticated = true
          this.profile = p ? JSON.parse(p) : null
        }
      } catch (e) {}
    },
  },
})
