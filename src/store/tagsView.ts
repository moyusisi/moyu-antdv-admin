import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'


export const useTagsViewStore
  = defineStore('tagsViewStore', () => {

  // 定义state
  const tagsView = ref<RouteRecordRaw[]>([])

  // 定义action
  const pushTagsView = (route) => {
    const target = tagsView.value.find((item) => item.path === route.path)
    const isName = route.name
    if (!target && isName) {
      tagsView.value.push(route)
    }
    if (target) {
      tagsView.value.forEach((item, index) => {
        if (item.path === route.path) {
          tagsView.value[index] = { ...route, ...item }
        }
      })
    }
  }
  const clearTagsView = () => {
    tagsView.value = []
  }

  return {
    tagsView,
    pushTagsView,
    clearTagsView
  }
})
