import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import { auth } from './firebase/config'
import { useAuthStore } from './stores/auth'

async function initApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
  })

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
