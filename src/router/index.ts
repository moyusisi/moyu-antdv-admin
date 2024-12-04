import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import whiteListRouters from './whiteList.ts'

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/index',
    component: () => import('@/views/hello/HelloWorld.vue'),
    meta: { hidden: true }
  }
]


const routes = [...constantRoutes, ...whiteListRouters]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
})

export default router
