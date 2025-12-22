<template>
  <div class="icon-bar">
    <!-- Dropdown de langue -->
    <LanguageDropdown />

    <!-- Icône de connexion -->
    <IconBarItem
      v-if="!sessionStore.isLogged"
      icon-class="ri-user-line"
      aria-label="Se connecter"
      @click="goToLogin"
    />
    <!-- Icônes quand connecté -->
    <template v-if="sessionStore.isLogged">
      <!-- Icône du compte -->
      <IconBarItem
        icon-class="ri-user-settings-line"
        aria-label="Mon compte"
        @click="goToAccount"
      />
      <!-- Icône de déconnexion -->
      <IconBarItem
        icon-class="ri-logout-box-line"
        aria-label="Se déconnecter"
        @click="logout"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import IconBarItem from './IconBarItem.vue'
import LanguageDropdown from './LanguageDropdown.vue'
import { useSessionStore } from '@/stores/session'
import { useToast } from 'vue-toastification'

const router = useRouter()
const sessionStore = useSessionStore()
const toast = useToast()

function goToLogin() {
  router.push({ name: 'login' })
}

function goToAccount() {
  router.push({ name: 'account' })
}

function logout() {
  sessionStore.logout()
  toast.success('Déconnexion réussie')
  router.push({ name: 'home' })
}
</script>

<style scoped>
.icon-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>