import { ref } from "vue"
import { defineStore } from "pinia"


export const useUserStore
  = defineStore('user', () => {

  // 定义state
  const userInfo = ref({
    roles: [],
    perms: [],
  })

  // 定义action
  const setUserInfo = (key) => {
    userInfo.value = key
  }

  return {
    userInfo,

    setUserInfo
  }
})
