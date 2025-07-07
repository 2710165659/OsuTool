import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/',component: HomeView,},
    {path: '/table',component: () => import('../views/TableView.vue')},
    {path: '/setting',component: () => import('../views/SettingView.vue')},
  ],
})

export default router
