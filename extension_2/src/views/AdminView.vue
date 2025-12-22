<template>
  <div class="admin">
    <h1>{{ t('admin') }}</h1>
    <p>{{ t('adminContent') }}</p>
    <p>{{ t('user') }}: <strong>{{ name }}</strong></p>
    <button @click="logout">Se déconnecter</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/session'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useSessionStore()
store.sync()
const name = computed(() => store.name)
function logout() { store.logout(); window.location.href = '/' }
</script>

<style scoped>
.admin { padding: 16px }
</style>
