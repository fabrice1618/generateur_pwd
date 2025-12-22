import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PasswordIdentity {
  id: string
  name: string
  username: string
  password: string
  createdAt: Date
}

export const usePasswordsStore = defineStore('passwords', {
  state: () => ({
    identities: [] as PasswordIdentity[]
  }),
  
  actions: {
    addIdentity(name: string, username: string, password: string) {
      const identity: PasswordIdentity = {
        id: Date.now().toString(),
        name: String(name || ''),
        username: String(username || ''),
        password: String(password || ''),
        createdAt: new Date()
      }
      this.identities.push(identity)
      // Suppression de la sauvegarde automatique
    },
    
    removeIdentity(id: string) {
      this.identities = this.identities.filter(identity => identity.id !== id)
      // Suppression de la sauvegarde automatique
    },
    
    updateIdentity(id: string, name: string, username: string, password: string) {
      const index = this.identities.findIndex(identity => identity.id === id)
      if (index !== -1) {
        this.identities[index] = {
          ...this.identities[index],
          name: String(name || ''),
          username: String(username || ''),
          password: String(password || '')
        }
        // Suppression de la sauvegarde automatique
      }
    }
  }
})