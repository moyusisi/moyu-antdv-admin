import { createRouter, createWebHistory } from 'vue-router'
import whiteListRouters from './whiteList'

// 公共路由
export const constantRoutes = [
  {
    path: '',
    component: () => import('@/views/hello/HelloWorld.vue'),
    hidden: true
  }
]


const routes = [...constantRoutes, ...whiteListRouters]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
