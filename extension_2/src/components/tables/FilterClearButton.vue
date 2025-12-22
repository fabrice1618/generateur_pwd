<template>
  <Button
    @click="$emit('clear')"
    :class="{ 'btn-danger': hasFilters }"
    variant="ghost"
    size="sm"
    :disabled="!hasFilters"
    :aria-label="label"
  >
    <i class="ri-close-line"></i>
    {{ label }}
  </Button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import Button from '../buttons/Button.vue'

withDefaults(defineProps<{
  hasFilters: boolean
  label?: string
}>(), {
  label: 'Effacer les filtres'
})

defineEmits<{
  clear: []
}>()
</script>

<style scoped>
.btn-danger {
  background-color: #dc3545 !important;
  color: white !important;
  border-color: #dc3545 !important;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333 !important;
  border-color: #c82333 !important;
}
</style>