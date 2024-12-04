import { ref } from "vue"
import { defineStore } from "pinia"
import config from "@/config"


export const useTagsViewStore
  = defineStore('tagsView', () => {

  // 定义state
  // 菜单是否折叠 toggle
  const menuCollapse = ref(config.MOYU_MENU_COLLAPSE)

  // 定义action


})
