<template>
  <div>
    <h1>Créer un compte</h1>
    <form @submit.prevent="doRegister">
      <label>
        Email:
        <input v-model="email" type="email" required />
      </label>
      <label>
        Mot de passe:
        <input v-model="password" type="password" required />
      </label>
      <div class="actions">
        <button type="submit">Créer un compte</button>
        <button type="button" @click="$router.push('/login')">Déjà un compte</button>
      </div>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const store = useUserStore()
const router = useRouter()

function doRegister() {
  error.value = ''
  try {
    if (!email.value || !password.value) return
    store.register(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e?.message || 'Erreur lors de la création de compte'
  }
}
</script>

<style scoped>
.actions { display:flex; flex-direction:column; gap:8px; margin-top:12px }
.actions button { width:100%; padding:8px 12px }
.error { color: #c00; margin-top:8px }
</style>
