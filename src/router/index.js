import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // hash模式
  routes: [
    {path: '/',component: HomeView,},
    {path: '/table',component: () => import('../views/TableView.vue')},
  ],
})

export default router
