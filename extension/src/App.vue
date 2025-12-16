<template>
  <div class="app-root">
    <header class="app-header">
      <div class="title">
        <h1 @click="$router.push('/')" class="clickable">Generator</h1>
      </div>
      <nav class="top-nav">
        <button @click="$router.push('/')">Générateur</button>
        <button v-if="!isAuthenticated" @click="$router.push('/login')">S'identifier</button>
        <button v-else @click="doLogout">Se déconnecter</button>
      </nav>
    </header>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from './stores/user'

const store = useUserStore()
const isAuthenticated = computed(() => store.isAuthenticated)

function doLogout() {
  store.logout()
}
</script>

<style scoped>
:root { --bg: #f6f7f9; --accent: #646cff }
.app-root { width: 420px; height: 560px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial; background: var(--bg); }
.app-header { background: #111; color: #fff; padding: 12px 16px; display:flex; align-items:center }
.app-header .title { display:flex; align-items:center; gap:8px }
.app-header h1 { font-size:16px; margin:0 }
.top-nav { margin-left: auto; display:flex; gap:10px; align-items:center }
.container { padding: 16px }
.settings h2 { margin: 0 0 8px }
.settings label { display:flex; align-items:center; gap:8px }
.entropy-value { margin-left: 8px; font-weight: 600 }
.note { margin-top:8px; color:#555 }
.controls { margin-top:12px; display:flex; gap:8px }
.controls button { padding:8px 12px; background:var(--accent); color:#fff; border:none; cursor:pointer }
.controls button[disabled] { opacity:0.5; cursor:not-allowed }
.result { margin-top:18px }
.password { width:100%; padding:10px; font-family: monospace; font-size:14px }
</style>
