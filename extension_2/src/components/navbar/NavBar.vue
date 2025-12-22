<template>
  <nav class="navbar">
    <!-- Onglet Générateur (toujours visible) -->
    <router-link
      to="/generator"
      class="nav-tab"
      :class="{ active: $route.name === 'generator' }"
    >
      <i class="ri-key-line"></i>
      <span>{{ $t('generator') }}</span>
    </router-link>

    <!-- Onglets quand connecté -->
    <template v-if="sessionStore.isLogged">
      <router-link
        to="/passwords"
        class="nav-tab"
        :class="{ active: $route.name === 'passwords' }"
      >
        <i class="ri-lock-line"></i>
        <span>{{ $t('myPasswords') }}</span>
      </router-link>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/session'
import { useRoute } from 'vue-router'

const sessionStore = useSessionStore()
const $route = useRoute()
</script>

<style scoped>
.navbar {
  display: flex;
  gap: 8px;
  border-radius: 8px;
  padding: 2px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease;
  position: relative;
  background: var(--bg);
  border: 1px solid var(--input-border);
}

.nav-tab:hover {
  background: var(--surface);
  color: var(--text);
  border-color: var(--input-focus);
}

.nav-tab.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  border-color: var(--color-primary);
}

.nav-tab i {
  font-size: 14px;
}

.nav-tab.active i {
  color: white;
}
</style>