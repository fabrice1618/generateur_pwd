import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export interface ModalConfig {
  id: string
  component?: string
  title?: string
  content?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  persistent?: boolean
  props?: Record<string, any>
  onConfirm?: () => void
  onCancel?: () => void
}

export const useModalStore = defineStore('modal', () => {
  const modals = ref<ModalConfig[]>([])

  const openModal = (config: Omit<ModalConfig, 'id'>) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const modalConfig: ModalConfig = {
      id,
      size: 'md',
      closable: true,
      persistent: false,
      ...config
    }

    modals.value.push(modalConfig)
    return id
  }

  const closeModal = (id: string) => {
    const index = modals.value.findIndex(modal => modal.id === id)
    if (index > -1) {
      modals.value.splice(index, 1)
    }
  }

  const closeAllModals = () => {
    modals.value = []
  }

  const confirmModal = (title: string, content: string, onConfirm?: () => void, onCancel?: () => void) => {
    return openModal({
      title,
      content,
      component: 'ConfirmModal',
      onConfirm,
      onCancel
    })
  }

  const alertModal = (title: string, content: string, onConfirm?: () => void) => {
    return openModal({
      title,
      content,
      component: 'AlertModal',
      onConfirm
    })
  }

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    confirmModal,
    alertModal
  }
})