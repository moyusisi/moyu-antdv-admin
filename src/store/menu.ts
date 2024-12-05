import { ref } from 'vue'
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'


export const useMenuStore
  = defineStore('menuStore', () => {

  // 定义state
  const routes = ref<RouteRecordRaw[]>([])

  // 定义action
  // 加载菜单
  const loadMenu = () => {
    routes.value = constantRoutes
    console.log('loadMenu')
  }

  return {
    routes,
    loadMenu
  }
})
