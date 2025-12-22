<template>
  <div class="text-input">
    <label v-if="label" class="label">{{ label }}</label>
    <select :value="modelValue" @change="onChange" class="input">
      <option v-for="(opt, idx) in options" :key="idx" :value="opt.value ?? opt">{{ opt.label ?? opt }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  options?: Array<any>
}>(), {
  modelValue: '',
  label: '',
  options: []
})

const { modelValue, label, options } = toRefs(props)

const emit = defineEmits<{ (e: 'update:modelValue', val: string | number): void }>()

function onChange(e: Event) {
  const t = e.target as HTMLSelectElement
  emit('update:modelValue', t.value)
}
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
}
.input:focus { outline: none; border-color: var(--input-focus); box-shadow: var(--input-focus-shadow); }
</style>
