<template>
  <I18nProvider>
    <div class="login-page">
      <div class="login-card">
        <h1 class="login-title">{{ t('login') }}</h1>
        <form @submit.prevent="handleLogin" class="login-form">
          <TextInput
            v-model="form.email"
            :label="t('email')"
            type="email"
            :error="errors.email"
            required
          />
          <PasswordInput
            v-model="form.password"
            :label="t('password')"
            :error="errors.password"
            required
          />
          <div class="demo-info">
            <small>Pour tester : demo@example.com / password</small>
            <button type="button" @click="quickLogin" class="quick-login-btn">Connexion rapide</button>
          </div>
          <Button type="submit" :loading="loading" class="login-btn">
            {{ t('login') }}
          </Button>
        </form>
        <p class="login-register">
          {{ t('noAccount') }}
          <router-link to="/register" class="register-link">{{ t('register') }}</router-link>
        </p>
      </div>
    </div>
  </I18nProvider>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import TextInput from '@/components/inputs/TextInput.vue'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import Button from '@/components/buttons/Button.vue'
import I18nProvider from '@/components/I18nProvider.vue'
import api from '@/services/api'

const { t } = useI18n()
const router = useRouter()
const session = useSessionStore()
const toast = useToast()

const loading = ref(false)
const form = reactive({
  email: '',
  password: ''
})
const errors = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  errors.email = ''
  errors.password = ''

  // Simulation d'une validation basique
  if (!form.email) {
    errors.email = t('emailRequired')
  }
  if (!form.password) {
    errors.password = t('passwordRequired')
  }

  if (errors.email || errors.password) {
    loading.value = false
    return
  }

  try {
    // Simulation de connexion (pas d'API)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Délai de 1 seconde
    
    // Simulation de succès pour demo@example.com / password
    if (form.email === 'demo@example.com' && form.password === 'password') {
      session.setTokens('fake-token', 'fake-refresh-token')
      session.login({
        isAdmin: false,
        name: 'Demo User',
        token: 'fake-token',
        refreshToken: 'fake-refresh-token'
      })
      
      toast.success(t('loginSuccess'))
      router.push({ name: 'passwords' })
    } else {
      throw new Error('Identifiants invalides')
    }
  } catch (error) {
    toast.error('Email ou mot de passe incorrect')
  } finally {
    loading.value = false
  }
}

async function quickLogin() {
  form.email = 'demo@example.com'
  form.password = 'password'
  await handleLogin()
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.login-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-btn {
  margin-top: 0.5rem;
}

.login-register {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-secondary);
}

.register-link {
  color: var(--accent);
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.demo-info {
  text-align: center;
  color: var(--text-secondary);
  font-size: 12px;
  margin: 8px 0;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.quick-login-btn {
  display: block;
  margin: 8px auto 0;
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.quick-login-btn:hover {
  background: #218838;
}
</style>