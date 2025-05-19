import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { auth } from './firebase/config'
import { useAuthStore } from './stores/auth'

const pinia = createPinia()
let app: ReturnType<typeof createApp> | null = null

auth.onAuthStateChanged((user) => {
  const authStore = useAuthStore()
  authStore.setUser(user)

  if (!app) {
    app = createApp(App)
    app.use(pinia)
    app.use(router)
    app.mount('#app')
  }
})
