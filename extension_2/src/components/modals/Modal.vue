<template>
  <Teleport to="#modal-container">
    <Transition name="modal" appear>
      <div v-if="isOpen" class="modal-overlay" @click="handleBackdropClick">
        <div
          class="modal-container"
          :class="`modal--${size}`"
          @click.stop
          role="dialog"
          :aria-labelledby="titleId"
          :aria-describedby="bodyId"
        >
          <header v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h2 :id="titleId" class="modal-title">{{ title }}</h2>
            </slot>
            <button
              v-if="closable"
              class="modal-close"
              @click="close"
              :aria-label="t('close')"
            >
              <i class="ri-close-line"></i>
            </button>
          </header>

          <div class="modal-body" :id="bodyId">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  close: []
  open: []
}>()

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  backdropClosable?: boolean
  persistent?: boolean
}>(), {
  modelValue: false,
  title: '',
  size: 'md',
  closable: true,
  backdropClosable: true,
  persistent: false
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  }
})

const titleId = ref(`modal-title-${Date.now()}`)
const bodyId = ref(`modal-body-${Date.now()}`)

const close = () => {
  if (!props.persistent) {
    isOpen.value = false
  }
}

const handleBackdropClick = () => {
  if (props.backdropClosable && !props.persistent) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value && !props.persistent) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// Exposer la méthode close pour usage externe
defineExpose({
  close
})
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  position: fixed;
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.modal--sm { width: 90%; max-width: 350px; }
.modal--md { width: 90%; max-width: 500px; }
.modal--lg { width: 95%; max-width: 550px; }
.modal--xl { width: 98%; max-width: 580px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--input-border);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--input-bg);
  color: var(--text);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--input-border);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    width: 100%;
    max-width: none;
    margin: 1rem;
  }

  .modal--sm,
  .modal--md,
  .modal--lg,
  .modal--xl {
    width: 100%;
  }
}
</style>