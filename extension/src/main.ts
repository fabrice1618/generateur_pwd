import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// restore stored auth if present
import { useUserStore } from './stores/user'
const store = useUserStore(pinia)
store.restoreFromStorage()

app.mount('#app')
