<template>
  <Modal
    :model-value="true"
    :title="title"
    size="sm"
    @close="handleConfirm"
  >
    <p>{{ content }}</p>

    <template #footer>
      <button class="btn btn-primary" @click="handleConfirm">
        {{ confirmText || t('ok') }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Modal from './Modal.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  title?: string
  content?: string
  confirmText?: string
  onConfirm?: () => void
}>(), {
  title: '',
  content: '',
  confirmText: '',
  onConfirm: () => {}
})

const handleConfirm = () => {
  props.onConfirm()
}
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}
</style>