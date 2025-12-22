<template>
  <Modal
    :model-value="true"
    :title="title"
    size="sm"
    @close="handleCancel"
  >
    <p>{{ content }}</p>

    <template #footer>
      <button class="btn btn-secondary" @click="handleCancel">
        {{ cancelText || t('cancel') }}
      </button>
      <button class="btn btn-primary" @click="handleConfirm">
        {{ confirmText || t('confirm') }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted } from 'vue'
import Modal from './Modal.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}>(), {
  title: '',
  content: '',
  confirmText: '',
  cancelText: '',
  onConfirm: () => {},
  onCancel: () => {}
})

const handleConfirm = () => {
  props.onConfirm()
}

const handleCancel = () => {
  props.onCancel()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleConfirm()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--input-text);
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: var(--input-focus);
}

.btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}

.btn-secondary {
  background: transparent;
}

.btn-secondary:hover {
  background: var(--input-bg);
}
</style>