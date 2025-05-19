import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AddMemory from '@/views/AddMemory.vue'
import EditMemory from '@/views/EditMemory.vue'
import RandomMemory from '@/views/RandomMemory.vue'
import Memories from '@/views/Memories.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresGuest: true } },
  { path: '/add', name: 'AddMemory', component: AddMemory, meta: { requiresAuth: true } },
  { path: '/edit', name: 'EditMemory', component: EditMemory, meta: { requiresAuth: true } },
  { path: '/random', name: 'RandomMemory', component: RandomMemory, meta: { requiresAuth: true } },
  { path: '/memories', name: 'Memories', component: Memories, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !user) {
    next('/login')
  } else if (requiresGuest && user) {
    next('/memories')
  } else {
    next()
  }
})

export default router
