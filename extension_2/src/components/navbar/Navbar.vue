<template>
  <nav class="navbar">
    <div class="left">
      <slot name="left">
        <NavItem :label="t('home')" to="/" />
        <NavItem :label="t('admin')" to="/admin" />
      </slot>
    </div>
    <div class="right">
        <slot name="right">
          <button v-if="!store.isLogged" @click="goToLogin" class="nav-btn">{{ t('login') }}</button>
          <span v-if="store.isLogged" class="nav-user">{{ store.name }}</span>
          <IconBar />
        </slot>
      </div>
  </nav>
</template>

<script setup lang="ts">
import NavItem from './NavItem.vue'
import IconBar from './IconBar.vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../../stores/session'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const store = useSessionStore()

function loginUser() {
  store.login({ isAdmin: false, name: 'User' })
  router.push({ name: 'home' })
}

function loginAdmin() {
  store.login({ isAdmin: true, name: 'Admin' })
  router.push({ name: 'admin' })
}

function logout() {
  store.logout()
  router.push({ name: 'home' })
}

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.navbar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 12px; background: transparent }
.left { display:flex; gap:8px }
.right { display:flex; gap:8px }
.nav-btn { background: transparent; border: 1px solid var(--input-border); padding: 6px 8px; border-radius: 6px; cursor: pointer; color: var(--text); }
.nav-user { padding: 6px 8px; color: var(--text); }
</style>
