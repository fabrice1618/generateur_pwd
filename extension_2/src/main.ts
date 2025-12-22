import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import { useSessionStore } from './stores/session'
import { usePermissionsStore } from './stores/permissions'
import { useUiStore } from './stores/ui'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Gestion d'erreur globale
app.config.errorHandler = (err, _instance, info) => {
  console.error('Erreur globale:', err, info)
}

// initialize session from localStorage before mounting
try {
	const session = useSessionStore()
	session.sync()
	
	// Synchroniser la locale i18n
	const { useI18nStore } = await import('./stores/i18n')
	const i18nStore = useI18nStore()
	i18nStore.syncLocale()
	
	// Wait for session sync to complete
	await new Promise(resolve => setTimeout(resolve, 100))
	
	const permissions = usePermissionsStore()
	// Initialiser avec le rôle basé sur la session
	if (session.isLogged && session.isAdmin) {
		permissions.setRole('admin')
	} else if (session.isLogged) {
		permissions.setRole('user')
	} else {
		permissions.setRole('guest')
	}
	const uiStore = useUiStore()
	uiStore.initResizeListener()
} catch (e) {
	// ignore
}

app.mount('#app')
