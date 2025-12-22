<template>
  <div class="color-picker">
    <div class="color-input-group">
      <input
        ref="colorInput"
        v-model="currentColor"
        type="color"
        class="color-input"
        @input="onColorChange"
      />
      <input
        v-model="hexValue"
        type="text"
        class="hex-input"
        :placeholder="t('hexColor')"
        @input="onHexInput"
        @blur="validateHex"
      />
    </div>

    <div v-if="showPalette" class="color-palette">
      <div
        v-for="color in palette"
        :key="color"
        class="palette-color"
        :style="{ backgroundColor: color }"
        @click="selectPaletteColor(color)"
      ></div>
    </div>

    <div class="color-preview">
      <div class="preview-box" :style="{ backgroundColor: currentColor }"></div>
      <span class="preview-text">{{ currentColor.toUpperCase() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: string
  showPalette?: boolean
  palette?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  showPalette: true,
  palette: () => [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#000080', '#008000', '#FF4500', '#DA70D6', '#40E0D0'
  ]
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

const colorInput = ref<HTMLInputElement>()
const currentColor = ref(props.modelValue)
const hexValue = ref(props.modelValue.toUpperCase())

// Computed
const isValidHex = computed(() => /^#[0-9A-F]{6}$/i.test(hexValue.value))

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  currentColor.value = newValue
  hexValue.value = newValue.toUpperCase()
})

function onColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  currentColor.value = target.value
  hexValue.value = target.value.toUpperCase()
  emit('update:modelValue', currentColor.value)
}

function onHexInput(event: Event) {
  const target = event.target as HTMLInputElement
  hexValue.value = target.value.toUpperCase()
}

function validateHex() {
  if (isValidHex.value) {
    currentColor.value = hexValue.value
    if (colorInput.value) {
      colorInput.value.value = currentColor.value
    }
    emit('update:modelValue', currentColor.value)
  } else {
    // Reset to current valid color
    hexValue.value = currentColor.value.toUpperCase()
  }
}

function selectPaletteColor(color: string) {
  currentColor.value = color
  hexValue.value = color.toUpperCase()
  if (colorInput.value) {
    colorInput.value.value = color
  }
  emit('update:modelValue', color)
}
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input {
  width: 60px;
  height: 40px;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  cursor: pointer;
}

.hex-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--input-bg);
  color: var(--input-text);
  font-family: monospace;
}

.hex-input:focus {
  outline: none;
  border-color: var(--input-focus);
  box-shadow: var(--input-focus-shadow);
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.palette-color {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: transform 0.2s ease;
}

.palette-color:hover {
  transform: scale(1.1);
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--input-border);
  border-radius: var(--input-radius);
  background: var(--surface);
}

.preview-box {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.preview-text {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--text);
}
</style>