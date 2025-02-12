import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ClassicLayout from '@/layout/ClassicLayout.vue'

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/test',
    component: () => import('@/views/hello/Test.vue'),
    meta: { hidden: true }
  },

  {
    path: '/',
    name: '/',
    component: ClassicLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/hello/HelloWorld.vue'),
        name: 'Home',
        meta: {
          title: 'Home',
          icon: 'homepage',
          affix: true,
          keepAlive: true,
          alwaysShow: false
        }
      }
    ]
  },
  {
    path: '/layout',
    name: 'ClassicLayout',
    component: ClassicLayout,
    redirect: '/layout/hello',
    children: [
      {
        path: 'hello',
        component: () => import('@/views/hello/HelloWorld.vue'),
        name: 'Hello',
        meta: {
          title: 'Hello',
          icon: 'homepage',
          affix: true,
          keepAlive: true,
          alwaysShow: false
        }
      }
    ]
  }
]


const routes = [...constantRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
})

export default router
