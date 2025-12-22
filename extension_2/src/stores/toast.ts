import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface Toast {
  id: string
  message: string
  type: ToastType
  timeout: number | false
  closeOnClick: boolean
  pauseOnFocusLoss: boolean
  pauseOnHover: boolean
  draggable: boolean
  draggablePercent: number
  showCloseButtonOnHover: boolean
  hideProgressBar: boolean
  closeButton: string
  icon: string
  createdAt: number
  pausedAt?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = (message: string, type: ToastType, options: Partial<Omit<Toast, 'id' | 'message' | 'type' | 'createdAt'>> = {}) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const toast: Toast = {
      id,
      message,
      type,
      timeout: type === 'error' ? 5000 : type === 'warning' ? 4000 : 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: getIconForType(type),
      createdAt: Date.now(),
      ...options
    }
    toasts.value.unshift(toast)
    if (toast.timeout !== false) {
      setTimeout(() => {
        removeToast(id)
      }, toast.timeout as number)
    }
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const updateToast = (id: string, message: string, type: ToastType, options: Partial<Toast> = {}) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.message = message
      toast.type = type
      toast.icon = getIconForType(type)
      Object.assign(toast, options)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  const getIconForType = (type: ToastType): string => {
    switch (type) {
      case 'success': return 'ri-check-line'
      case 'error': return 'ri-error-warning-line'
      case 'warning': return 'ri-alert-line'
      case 'info': return 'ri-information-line'
      case 'loading': return 'ri-loader-4-line'
      default: return ''
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearToasts
  }
})