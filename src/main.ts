import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth } from './firebase/config'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

router.isReady().then(() => {
  const authStore = useAuthStore()
  auth.onAuthStateChanged((user) => {
    authStore.setUser(user)
  })

  app.mount('#app')
})
