import { useToastStore, type ToastType } from '../stores/toast'

export const useToast = () => {
  const toastStore = useToastStore()

  const success = (message: string, options?: any) => {
    return toastStore.addToast(message, 'success', {
      timeout: 3000,
      ...options
    })
  }

  const error = (message: string, options?: any) => {
    return toastStore.addToast(message, 'error', {
      timeout: 5000,
      ...options
    })
  }

  const warning = (message: string, options?: any) => {
    return toastStore.addToast(message, 'warning', {
      timeout: 4000,
      ...options
    })
  }

  const info = (message: string, options?: any) => {
    return toastStore.addToast(message, 'info', {
      timeout: 3000,
      ...options
    })
  }

  const loading = (message: string, options?: any) => {
    return toastStore.addToast(message, 'loading', {
      timeout: false,
      ...options
    })
  }

  const update = (toastId: string, message: string, type: ToastType, options?: any) => {
    toastStore.updateToast(toastId, message, type, options)
  }

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toastStore.removeToast(toastId)
    } else {
      toastStore.clearToasts()
    }
  }

  const clear = () => {
    toastStore.clearToasts()
  }

  return {
    success,
    error,
    warning,
    info,
    loading,
    update,
    dismiss,
    clear
  }
}