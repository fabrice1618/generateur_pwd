<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const { variant, size, disabled } = toRefs(props)
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: var(--input-radius);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 160ms, border-color 160ms, color 160ms, box-shadow 160ms;
}

/* sizes */
.btn--sm { padding: 6px 10px; font-size: 0.875rem }
.btn--md { padding: 8px 14px; font-size: 1rem }
.btn--lg { padding: 12px 18px; font-size: 1.05rem }

/* variants */
.btn--primary {
  background: var(--color-primary);
  color: var(--bg);
}
.btn--primary:hover { filter: brightness(0.95) }

.btn--secondary {
  background: var(--color-secondary);
  color: var(--bg);
}
.btn--secondary:hover { filter: brightness(0.95) }

.btn--ghost {
  background: transparent;
  color: var(--text);
  border-color: var(--input-border);
}
.btn--ghost:hover { background: rgba(0,0,0,0.04) }

.btn:focus {
  outline: none;
  box-shadow: var(--input-focus-shadow);
  border-color: var(--input-focus);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
