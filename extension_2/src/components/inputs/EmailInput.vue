<template>
  <div class="text-input">
    <label v-if="label" class="label">{{ label }}</label>
    <input
      type="email"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="input"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
}>(), {
  modelValue: '',
  label: '',
  placeholder: ''
})

const { modelValue, label, placeholder } = toRefs(props)

const emit = defineEmits<{ (e: 'update:modelValue', val: string): void }>()
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
.input::placeholder { color: var(--input-placeholder); }
.input:focus { outline: none; border-color: var(--input-focus); box-shadow: var(--input-focus-shadow); }
</style>
