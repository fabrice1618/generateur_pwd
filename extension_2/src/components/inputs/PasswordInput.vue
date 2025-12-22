<template>
  <div class="text-input password-input">
    <label v-if="label" class="label" v-html="label"></label>
    <div class="input-wrap">
      <input
        :type="readonly ? 'password' : inputType"
        :placeholder="placeholder"
        :value="modelValue"
        :readonly="readonly"
        @input="readonly ? null : onInput($event)"
        class="input"
      />
      <i
        v-if="!readonly || allowToggleInReadonly"
        :class="iconClass"
        class="toggle-icon"
        @click="toggleVisibility"
        role="button"
        aria-label="Toggle password visibility"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  readonly?: boolean
  allowToggleInReadonly?: boolean
}>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'password',
  readonly: false,
  allowToggleInReadonly: false
})

const { modelValue, label, placeholder } = toRefs(props)

const emit = defineEmits<{ (e: 'update:modelValue', val: string): void }>()

const visible = ref(false)
const inputType = computed(() => (visible.value ? 'text' : 'password'))

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function toggleVisibility() {
  visible.value = !visible.value
}

const iconClass = computed(() => (visible.value ? 'ri-eye-off-line' : 'ri-eye-line'))
</script>

<style scoped>
.text-input { width: 100%; display: flex; flex-direction: column; }
.label { margin-bottom: 6px; font-weight: 600; align-self: flex-start; text-align: left; }
.input-wrap { position: relative; width: 100%; }
.input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 38px 8px 10px;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--input-bg);
  color: var(--input-text);
  font-size: 1rem;
}
.input::placeholder { color: var(--input-placeholder); }
.input:focus { outline: none; border-color: var(--input-focus); box-shadow: var(--input-focus-shadow); }
.toggle-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; cursor: pointer; color: var(--input-placeholder) }
.toggle-icon:hover { color: var(--input-focus) }
</style>
