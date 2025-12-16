<template>
  <div>
    <h1>S'identifier</h1>
    <form @submit.prevent="doLogin">
      <label>
        Email:
        <input v-model="email" type="email" required />
      </label>
      <label>
        Mot de passe:
        <input v-model="password" type="password" required />
      </label>
      <div class="actions">
        <button type="submit">Se connecter</button>
        <button type="button" @click="$router.push('/register')">Créer un compte</button>
      </div>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()
const store = useUserStore()

async function doLogin() {
  error.value = ''
  try {
    if (!email.value || !password.value) return
    store.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } catch (e: any) {
    error.value = e?.message || 'Erreur lors de la connexion'
  }
}
</script>

<style scoped>
.actions { display:flex; flex-direction:column; gap:8px; margin-top:12px }
.actions button { width:100%; padding:8px 12px }
.error { color: #c00; margin-top:8px }
</style>
