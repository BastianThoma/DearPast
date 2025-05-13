import { createRouter, createWebHistory } from 'vue-router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { auth } from '@/firebase/config'


import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AddMemory from '@/views/AddMemory.vue'
import RandomMemory from '@/views/RandomMemory.vue'
import Memories from '@/views/Memories.vue'
import EditMemory from '@/views/EditMemory.vue';

let requireAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  let user = auth.currentUser;
  if (!user) {
    next('/login');
  } else {
    next();
  }
};

let routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/add', name: 'AddMemory', component: AddMemory, beforeEnter: requireAuth },
  { path: '/edit', name: 'edit-memory', component: EditMemory, beforeEnter: requireAuth },
  { path: '/random', name: 'RandomMemory', component: RandomMemory, beforeEnter: requireAuth },
  { path: '/memories', name: 'Memories', component: Memories, beforeEnter: requireAuth },
]

let router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
