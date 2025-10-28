import { defineStore } from 'pinia'
import loginApi from '@/api/auth/loginApi'
import userCenterApi from '@/api/sys/userCenterApi'
import { UserInfo } from "@/api/sys/types.ts";

export const useUserStore = defineStore('userStore', () => {
  // 定义state
  // 用户信息
  const userInfo = ref<UserInfo>({});

  // 在 Setup Stores 中，您需要创建自己的 $reset() 方法 https://pinia.vuejs.org/zh/core-concepts/state.html
  function $reset() {
    userInfo.value = {}
  }

  // 定义action
  // 登录
  const login = async ({ account, password }) => {
    // 获取token
    const res = await loginApi.login({ account, password })
    if (!res.data) {
      // 这等价于 Promise.reject(new Error("Rejected value"))
      throw new Error("登录失败");
    }
    localStorage.setItem('TOKEN', res.data)
  }

  const logout = async () => {
    await loginApi.logout()
    clear()
  }

  const clear = () => {
    // 清理掉个人的一些信息
    localStorage.removeItem('TOKEN')
    localStorage.removeItem('USER_INFO')
    userInfo.value = {}
  }

  // 初始化用户信息
  const initUserInfo = async () => {
    const res = await userCenterApi.loginUserInfo()
    if (!res.data.roles || res.data.roles.length <= 0) {
      // 这等价于 Promise.reject(new Error("Rejected value"))
      throw new Error("initUserInfo: 用户权限不能为空");
    }
    userInfo.value = res.data
    localStorage.setItem('USER_INFO', JSON.stringify(userInfo.value))
  }
  // 刷新登录用户信息
  const refreshUserInfo = async () => {
    const res = await userCenterApi.loginUserInfo()
    userInfo.value = res.data
    localStorage.setItem('USER_INFO', JSON.stringify(userInfo.value))
  }

  // 切换用户岗位身份
  const switchUserGroup = async (groupCode: string) => {
    const res = await userCenterApi.switchUserGroup({ code: groupCode })
    localStorage.setItem('TOKEN', res.data)
    await refreshUserInfo()
  }

  return {
    login,
    logout,
    userInfo,
    $reset,
    initUserInfo,
    refreshUserInfo,
    switchUserGroup
  }
})