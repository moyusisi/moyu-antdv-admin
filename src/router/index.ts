import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import systemRouter from './systemRouter'
import NProgress from '@/utils/nprogress'
import settings from "@/config/settings.ts"

const routes = [...systemRouter]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
})

// 白名单路由
const whiteList = ["/login", "/callback"]


// 导航守卫 参考：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
router.beforeEach(async (to, from) => {
  NProgress.start()

  // 设置动态标题
  document.title = to.meta.title ? `${to.meta.title} - ${settings.title}` : `${settings.title}`

})

router.afterEach((to, from) => {
  // TODO
  NProgress.done()
})

router.onError((error) => {
  NProgress.done()
  console.error({ message: '路由错误', description: error.message })
})

export default router
