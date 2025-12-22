<template>
  <label class="radio-input" :class="{ disabled }">
    <input
      type="radio"
      :value="value"
      :checked="modelValue === value"
      :name="name"
      :disabled="disabled"
      @change="onChange"
      class="radio-hidden"
    />
    <span class="radio-custom" :class="{ checked: modelValue === value }">
      <span v-if="modelValue === value" class="radio-dot"></span>
    </span>
    <span v-if="label" class="radio-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number | boolean
  value: string | number | boolean
  label?: string
  name?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number | boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    emit('update:modelValue', props.value)
  }
}
</script>

<style scoped>
.radio-input {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
}

.radio-input.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.radio-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid var(--input-border);
  border-radius: 50%;
  background: var(--input-bg);
  transition: all 0.2s ease;
  position: relative;
}

.radio-custom.checked {
  border-color: var(--primary);
}

.radio-custom:hover:not(.radio-input.disabled .radio-custom) {
  border-color: var(--primary);
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
}

.radio-label {
  color: var(--text);
  font-size: 1rem;
}
</style>