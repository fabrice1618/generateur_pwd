<template>
  <label class="checkbox-input" :class="{ disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
      class="checkbox-hidden"
    />
    <span class="checkbox-custom" :class="{ checked: modelValue }">
      <i v-if="modelValue" class="ri-check-line check-icon"></i>
    </span>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits<Emits>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<style scoped>
.checkbox-input {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
}

.checkbox-input.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  transition: all 0.2s ease;
}

.checkbox-custom.checked {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-custom:hover:not(.checkbox-input.disabled .checkbox-custom) {
  border-color: var(--primary);
}

.check-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.checkbox-label {
  color: var(--text);
  font-size: 1rem;
}
</style>