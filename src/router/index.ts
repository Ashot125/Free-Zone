import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/views/RegisterView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/register', name: 'Register', component: Register },
  {path: '/become-partner', name: 'BecomePartner', component: () => import('@/views/BecomePartner.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } // <-- ДВОЁНОЕ РЕШЕНИЕ ПРОБЛЕМЫ
  }
})
export default router

