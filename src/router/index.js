import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/',component: HomeView,},
    {path: '/table',component: () => import('../views/TableView.vue')},
  ],
})

export default router
