import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth } from './firebase/config'
import { useAuthStore } from './stores/auth'

async function initApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  await router.isReady()

  const authStore = useAuthStore()

  await new Promise<void>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      authStore.setUser(user)
      unsubscribe()
      resolve()
    })
  })

  app.mount('#app')
}

initApp()
