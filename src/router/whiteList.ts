import { RouteRecordRaw } from "vue-router";

/**
 * 路由白名单
 */
const constRouters: RouteRecordRaw[] = [
  {
    path: '/findpwd'
  },
  {
    path: '/callback'
  },
  // {
  //   path: '/other',
  //   name: 'other',
  //   component: () => import('@/views/other/index.vue'),
  //   meta: {
  //     title: '其他'
  //   }
  // }
]

export default constRouters