import { defineStore } from 'pinia'
import { useSearchStore } from '@/store/search'
import userCenterApi from '@/api/sys/userCenterApi'
import router, { constRoutes } from '@/router'
import { RouteRecordRaw } from "vue-router"
// 布局组件, 一般顶层目录使用
import Layout from '@/layout/index.vue'
// 空布局。多层目录嵌套时需要使用
import Empty from '@/layout/empty.vue'

// login和findPwd路由组件已静态加载，此处不在进行异步加载
const modules = import.meta.glob([
  '/src/views/**/**.vue',
  '!/src/views/auth/findPwd/**.vue',
  '!/src/views/auth/login/**.vue'
])

export const useMenuStore = defineStore('menuStore', () => {
  // state
  // 所有路由(静态路由 + 动态路由)
  const routes = ref<RouteRecordRaw[]>([]);
  const dynamicRouter = ref<boolean>(false)
  // 所有模块的menu,用于保存后端返回的原始数据
  const menuList = ref([])

  // actions
  /**
   * 初始化模块及菜单(优先本地，无则api获取)
   */
  const initModuleMenu = async () => {
    // 优先获取本地数据
    const menu = localStorage.getItem('MENU')
    let localMenu = JSON.parse(menu as string)
    if (localMenu) {
      menuList.value = localMenu
    } else {
      // 本地无则从api获取
      await refreshModuleMenu()
    }
  };

  /**
   * 从api更新模块及菜单
   */
  const refreshModuleMenu = async () => {
    const res = await userCenterApi.loginUserMenu()
    localStorage.setItem('MENU', JSON.stringify(res.data))
    menuList.value = res.data
  };

  /**
   * 清空菜单及路由数据
   */
  const clear = async () => {
    menuList.value = []
    routes.value = []
    dynamicRouter.value = false
    localStorage.removeItem('MENU')
  }

  /**
   * 生成菜单及异步(动态)路由
   */
  const generateRoutes = async () => {
    // 加载菜单数据(优先本地，其次接口)
    await initModuleMenu()
    // 生成动态路由
    const asyncRoutes: RouteRecordRaw[] = parseAsyncRoutes(menuList.value);
    // 设置routes
    routes.value = [...constRoutes, ...asyncRoutes];
    // 添加到路由组件中
    addToRouter(asyncRoutes)
    dynamicRouter.value = true
    // 初始化面包屑
    initBreadcrumb(routes.value)
    // 初始化搜索
    const searchStore = useSearchStore()
    searchStore.init(routes.value)
    return asyncRoutes;
  };

  /**
   * 重新生成菜单及异步(动态)路由
   */
  const reloadRoutes = async () => {
    clear()
    // 更新菜单数据
    await refreshModuleMenu()
    // 先移除之前的动态路由
    const currentRoutes = router.getRoutes()
    currentRoutes.forEach(route => {
      const isConstRoute = constRoutes.some(e => e.name === route.name)
      if (!isConstRoute) {
        router.removeRoute(route.name as string)
      }
    });
    // 生成动态路由
    await generateRoutes()
  };

  // 将菜单添加到路由
  const addToRouter = (asyncRoutes: RouteRecordRaw[]) => {
    // 添加到路由组件中
    asyncRoutes.forEach((route: RouteRecordRaw) => {
      // 如果最顶层目录有component=Layout，则直接设置路由。
      // router.addRoute(route);
      // 如果顶层route没有component=Layout,则需要指定使用布局的parentName(静态路由中已存在的)
      router.addRoute('layout', route)
    });
  }

  // 转换为路由对象
  const parseAsyncRoutes = (menus) => {
    const asyncRoutes: RouteRecordRaw[] = [];
    // 遍历所有菜单
    menus.forEach((menu) => {
      menu.meta = menu.meta ? menu.meta : {}
      // 处理外部链接特殊路由
      if (menu.meta.type === 'iframe') {
        menu.meta.url = menu.path
        menu.path = `/${menu.code}`
      }
      // menu转路由对象
      const route: RouteRecordRaw = {
        name: menu.code,
        path: menu.path,
        meta: menu.meta,
        redirect: menu.redirect,
        children: menu.children && menu.children.length > 0 ? parseAsyncRoutes(menu.children) : undefined,
        component: loadComponent(menu)
      }
      asyncRoutes.push(route);
    });
    return asyncRoutes;
  }

  // 加载组件
  const loadComponent = (menu) => {
    // 资源类型（字典 1模块 2目录 3菜单 4内链 5外链）
    let item = Empty;
    const component = menu.component
    if (component?.toString() === "Layout") {
      item = Layout
    } else {
      item = modules[`/src/views/${component}.vue`] || modules[`/src/views/${component}/index.vue`] || Empty
    }
    return item
  }

  /**
   * 根据当前的routes生成菜单的面包屑
   */
  const initBreadcrumb = (routes: RouteRecordRaw[], breadcrumb: RouteRecordRaw[] = []) => {
    routes.forEach((route) => {
      // 生成当前route的breadcrumb
      const temp: RouteRecordRaw[] = [...breadcrumb]
      temp.push(route)
      // 防止meta为空
      if (!route.meta) {
        route.meta = {}
      }
      // 设置在route的meta中
      route.meta.breadcrumb = temp
      // 若有子路由则递归设置子路由
      if (route.children) {
        initBreadcrumb(route.children, temp)
      }
    })
  }

  return {
    routes,
    dynamicRouter,
    clear,
    generateRoutes,
    reloadRoutes
  }
})
