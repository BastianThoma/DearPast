import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AddMemory from '@/views/AddMemory.vue'
import RandomMemory from '@/views/RandomMemory.vue'
import Memories from '@/views/Memories.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/add', name: 'AddMemory', component: AddMemory },
  { path: '/random', name: 'RandomMemory', component: RandomMemory },
  { path: '/memories', name: 'Memories', component: Memories },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
