import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import whiteListRouters from './whiteList.ts'
import ClassicLayout from '@/layout/ClassicLayout.vue';

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/hello/Test.vue'),
    redirect: '/home',
    meta: {
      title: '首页'
    },
    children: []
  },
  {
    path: '/test',
    component: () => import('@/views/hello/Test.vue'),
  },
  {
    path: '/index',
    component: () => import('@/views/hello/HelloWorld.vue'),
    meta: { hidden: true }
  },
  {
    path: '/layout',
    name: 'ClassicLayout',
    component: ClassicLayout,
    children: [
      {
        path: "/hello",
        component: () => import('@/views/hello/HelloWorld.vue'),
        name: "Hello",
        meta: {
          title: "Hello",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          alwaysShow: false,
        }
      }
    ]
  }
]


const routes = [...constantRoutes, ...whiteListRouters]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
})

export default router
