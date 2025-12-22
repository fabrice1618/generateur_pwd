<template>
  <div v-if="visible" class="loader-overlay" role="status" aria-live="polite">
    <div class="loader-box">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLoaderStore } from '../../stores/loader'

const store = useLoaderStore()
const visible = computed(() => store.visible)
</script>

<style scoped>
.loader-overlay{
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  z-index: 9999;
}
.loader-box{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  padding:16px 20px;
  background: var(--surface, #fff);
  color: var(--text, #111);
  border-radius:8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.spinner{
  width:36px;
  height:36px;
  border-radius:50%;
  border:4px solid rgba(0,0,0,0.08);
  border-top-color: var(--color-primary, #4f46e5);
  animation: spin 1s linear infinite;
}
.loader-text{font-size:14px}

@keyframes spin{to{transform:rotate(360deg)}}
</style>
