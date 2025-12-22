<template>
  <div class="pagination">
    <div class="page-info">
      <span>{{ totalItems }} éléments</span>
    </div>

    <div class="page-navigation">
      <button
        @click="$emit('update:currentPage', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="nav-btn"
        aria-label="Page précédente"
      >
        <i class="ri-arrow-left-s-line"></i>
      </button>

      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('update:currentPage', page)"
          :class="['page-btn', { active: page === currentPage }]"
          :aria-label="`Page ${page}`"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="$emit('update:currentPage', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="nav-btn"
        aria-label="Page suivante"
      >
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  totalItems: number
  pageSize: number
  currentPage: number
}>(), {
  // No defaults needed
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--input-border);
  border-radius: 6px;
}

.page-info {
  font-weight: 500;
  color: var(--text-secondary, #666);
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-numbers {
  display: flex;
  gap: 2px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--input-text);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.page-btn:hover:not(.active) {
  background: rgba(59, 130, 246, 0.7);
  border-color: rgba(59, 130, 246, 0.7);
  color: white;
}

.page-btn.active:hover {
  background: rgba(23, 93, 220, 0.8);
  border-color: rgba(23, 93, 220, 0.8);
  color: white;
}

.page-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 500;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--input-text);
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--input-focus);
  border-color: var(--input-focus);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-input {
  width: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .page-info {
    order: 1;
  }

  .page-navigation {
    order: -1;
  }
}
</style>