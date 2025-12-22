<template>
  <I18nProvider>
    <div class="register-page">
      <div class="register-card">
        <h1 class="register-title">{{ t('register') }}</h1>
      <form @submit.prevent="handleRegister" class="register-form">
        <TextInput
          v-model="form.name"
          :label="t('name')"
          :error="errors.name"
          required
        />
        <EmailInput
          v-model="form.email"
          :label="t('email')"
          :error="errors.email"
          required
        />
        <PasswordInput
          v-model="form.password"
          :label="t('password')"
          :error="errors.password"
          required
        />
        <PasswordInput
          v-model="form.confirmPassword"
          :label="t('confirmPassword')"
          :error="errors.confirmPassword"
          required
        />
        <Button type="submit" :loading="loading" class="register-btn">
          {{ t('register') }}
        </Button>
      </form>
      <div class="demo-info">
        <small>L'inscription fonctionne avec n'importe quels identifiants valides</small>
      </div>
      <p class="register-login">
        {{ t('haveAccount') }}
        <router-link to="/login" class="login-link">{{ t('login') }}</router-link>
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
import EmailInput from '@/components/inputs/EmailInput.vue'
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
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function handleRegister() {
  loading.value = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  // Validation basique
  if (!form.name) {
    errors.name = t('nameRequired')
  }
  if (!form.email) {
    errors.email = t('emailRequired')
  }
  if (!form.password) {
    errors.password = t('passwordRequired')
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = t('passwordMismatch')
  }

  if (Object.values(errors).some(e => e)) {
    loading.value = false
    return
  }

  try {
    // Simulation d'inscription (pas d'API)
    await new Promise(resolve => setTimeout(resolve, 1500)) // Délai de 1.5 seconde
    
    // Simulation de succès
    session.setTokens('fake-token-' + Date.now(), 'fake-refresh-token-' + Date.now())
    session.login({
      isAdmin: false,
      name: form.name,
      token: 'fake-token-' + Date.now(),
      refreshToken: 'fake-refresh-token-' + Date.now()
    })

    toast.success('Inscription réussie !')
    router.push({ name: 'passwords' })
  } catch (error) {
    toast.error(t('registerError'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.register-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

.register-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-btn {
  margin-top: 0.5rem;
}

.register-login {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-secondary);
}

.login-link {
  color: var(--accent);
  text-decoration: none;
}

.login-link:hover {
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
</style>