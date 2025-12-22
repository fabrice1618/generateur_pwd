<template>
  <button
    type="button"
    :class="['icon-btn', `icon-btn--${size}`]"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
const emit = defineEmits(['click'])
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}>(), {
  size: 'md',
  ariaLabel: 'icon button'
})

const { size, ariaLabel } = toRefs(props)
</script>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--input-text);
  cursor: pointer;
}
.icon-btn--sm { width: 32px; height: 32px; font-size: 1rem }
.icon-btn--md { width: 40px; height: 40px; font-size: 1.15rem }
.icon-btn--lg { width: 48px; height: 48px; font-size: 1.35rem }

.icon-btn:hover { box-shadow: var(--input-focus-shadow); border-color: var(--input-focus) }
.icon-btn:focus { outline: none; box-shadow: var(--input-focus-shadow); }
</style>
