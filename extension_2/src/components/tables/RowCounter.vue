<template>
  <div class="row-counter">
    <span v-if="showing === total">
      {{ total }} {{ total === 1 ? 'ligne' : 'lignes' }}
    </span>
    <span v-else>
      {{ showing }} lignes affichées sur {{ total }}
      <span v-if="currentPage > 1 || pageSize < total">
        (page {{ currentPage }})
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  total: number
  showing: number
  currentPage: number
  pageSize: number
}>()
</script>

<style scoped>
.row-counter {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>