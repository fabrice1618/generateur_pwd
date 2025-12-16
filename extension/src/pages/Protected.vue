<template>
  <div>
    <h1>Protected</h1>
    <p>This route requires authentication.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

function logout() {
  store.logout()
  router.push('/')
}
</script>

<style scoped>
</style>
