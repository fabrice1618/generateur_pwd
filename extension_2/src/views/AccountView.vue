<template>
  <div class="account">
    <h1>{{ $t('myAccount') }}</h1>
    <div class="account-info">
      <div class="info-group">
        <label for="account-name">{{ $t('name') }}:</label>
        <input
          id="account-name"
          type="text"
          :value="sessionStore.name || 'Non défini'"
          readonly
          class="info-input"
        />
      </div>

      <div class="info-group">
        <label for="account-email">{{ $t('email') }}:</label>
        <input
          id="account-email"
          type="email"
          :value="sessionStore.email || 'Non défini'"
          readonly
          class="info-input"
        />
      </div>

      <div class="info-group">
        <label for="account-uuid">{{ $t('accountId') }}:</label>
        <input
          id="account-uuid"
          type="text"
          :value="sessionStore.uuid"
          readonly
          class="info-input"
        />
      </div>

      <div class="info-group">
        <label for="account-role">{{ $t('role') }}:</label>
        <input
          id="account-role"
          type="text"
          :value="sessionStore.isAdmin ? $t('administrator') : $t('user')"
          readonly
          class="info-input"
        />
      </div>

      <div class="info-group">
        <label for="account-status">{{ $t('connectionStatus') }}:</label>
        <input
          id="account-status"
          type="text"
          :value="$t('connected')"
          readonly
          class="info-input status-connected"
        />
      </div>
    </div>

    <div class="actions">
      <button @click="logout" class="btn-logout">
        <i class="ri-logout-box-line"></i>
        {{ $t('logout') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { useToast } from 'vue-toastification'

const router = useRouter()
const sessionStore = useSessionStore()
const toast = useToast()

const logout = () => {
  sessionStore.logout()
  toast.success('Déconnexion réussie')
  router.push({ name: 'home' })
}
</script>

<style scoped>
.account {
  padding: 16px;
}

h1 {
  color: var(--text);
  margin-bottom: 24px;
  text-align: center;
}

.account-info {
  background: var(--surface);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.info-group:last-child {
  margin-bottom: 0;
}

.info-group label {
  font-weight: 500;
  color: var(--text);
  font-size: 14px;
}

.info-input {
  padding: 8px 12px;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 14px;
  width: 100%;
  max-width: 300px;
  cursor: not-allowed;
  opacity: 0.8;
}

.info-input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: var(--input-focus-shadow);
}

.info-input.status-connected {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.actions {
  display: flex;
  justify-content: center;
}

.btn-logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
}

.btn-logout:hover {
  background: #dc2626;
}
</style>