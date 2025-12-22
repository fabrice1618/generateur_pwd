import { ref } from 'vue'

export const usePWA = () => {
  const installable = ref(false)
  const deferredPrompt = ref<Event | null>(null)

  const initPWA = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt.value = e
      installable.value = true
    })

    window.addEventListener('appinstalled', () => {
      // Hide the install button
      installable.value = false
      deferredPrompt.value = null
    })
  }

  const installPWA = async () => {
    if (!deferredPrompt.value) return

    // Show the install prompt
    deferredPrompt.value.prompt()
    // Wait for the user to respond to the prompt
    const { outcome } = await (deferredPrompt.value as any).userChoice
    // Reset the deferred prompt
    deferredPrompt.value = null
    installable.value = false
  }

  return {
    installable,
    initPWA,
    installPWA
  }
}