<template>
  <div class="text-input">
    <label v-if="label" class="label" v-html="label"></label>
    <template v-if="readonly">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        readonly
        class="input"
      />
    </template>
    <template v-else>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        class="input"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  name?: string
  rules?: string | object
  readonly?: boolean
}>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  name: '',
  rules: '',
  readonly: false
})

const { label, placeholder, type } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()
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
.input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: var(--input-focus-shadow);
}
.input-error {
  border-color: var(--error-color, #e74c3c);
}
.error-message {
  color: var(--error-color, #e74c3c);
  font-size: 0.875rem;
  margin-top: 4px;
}
</style>
