<template>
  <div class="text-input">
    <label v-if="label" class="label">{{ label }}</label>
    <textarea
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput($event)"
      class="input"
      :rows="rows"
      :style="maxStyle"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
}>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  rows: 4
})

const { modelValue, label, placeholder, rows } = toRefs(props)

const emit = defineEmits<{ (e: 'update:modelValue', val: string): void }>()

function onInput(e: Event) {
  const t = e.target as HTMLTextAreaElement
  emit('update:modelValue', t.value)
}
const maxHeight = toRefs(props).maxHeight
const maxStyle = computed(() => {
  if (!maxHeight?.value && maxHeight?.value !== 0) return undefined
  const v = maxHeight.value
  const css = typeof v === 'number' ? `${v}px` : v
  return { maxHeight: css }
})
</script>

<style scoped>
.text-input { width: 100%; display: flex; flex-direction: column; }
.label { margin-bottom: 6px; font-weight: 600; align-self: flex-start; text-align: left; }
.input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 1rem;
  resize: vertical;
}
.input::placeholder { color: var(--input-placeholder); }
.input:focus { outline: none; border-color: var(--input-focus); box-shadow: var(--input-focus-shadow); }
</style>
