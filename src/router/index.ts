import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/hello',
    name: 'Hello',
    component: () => import('@/views/hello/HelloWorld.vue'),
    meta: { title: "Hello", hidden: true }
  }
]


const routes = [...constantRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
})

export default router
