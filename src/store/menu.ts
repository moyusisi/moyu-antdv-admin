import { ref } from "vue"
import { defineStore } from "pinia"
import { constantRoutes } from "@/router";
import { RouteRecordRaw } from 'vue-router';


export const useMenuStore
  = defineStore('menuStore', () => {

  // 定义state
  const routes = ref<RouteRecordRaw[]>([]);

  // 定义action
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }


  /**
   * 生成动态路由
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      listRoutes().then(({ data: asyncRoutes }) => {
        // 根据角色获取有访问权限的路由
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
        setRoutes(accessedRoutes);
        resolve(accessedRoutes);
      });
    });
  }
})
