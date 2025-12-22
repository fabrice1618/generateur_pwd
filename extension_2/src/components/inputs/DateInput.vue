<template>
  <div class="date-input">
    <label v-if="label" class="label">{{ label }}</label>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field, errorMessage }"
    >
      <input
        v-bind="field"
        type="date"
        :placeholder="placeholder"
        class="input"
        :class="{ 'input-error': errorMessage }"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </Field>
    <ErrorMessage :name="name" class="error-message" />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { Field, ErrorMessage } from 'vee-validate'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  name?: string
  rules?: string | object
}>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  name: '',
  rules: ''
})

const { label, placeholder, name, rules } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()
</script>

<style scoped>
.date-input {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.label {
  margin-bottom: 6px;
  font-weight: 600;
  align-self: flex-start;
  text-align: left;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--input-border, #d1d5db);
  border-radius: 6px;
  background: var(--input-bg, #fff);
  color: var(--input-text, #111);
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--input-focus, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--input-placeholder, #9ca3af);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  margin-top: 4px;
  font-size: 0.8rem;
  color: #ef4444;
}
</style>