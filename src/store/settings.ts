import { ref } from "vue"
import { defineStore } from "pinia"
import defaultSettings from "@/config/settings.ts";


export const useSettingsStore
  = defineStore('settings', () => {

  // 定义state
  // 移动端布局
  const isMobile = ref(false)
  // 布局
  const layout = ref(defaultSettings.layout)
  // 主题
  const theme = ref(defaultSettings.theme)
  // 主题颜色
  const themeColor = ref(defaultSettings.themeColor)
  // 布局大小
  const themeSize = ref(defaultSettings.themeSize)
  // 多标签栏
  const tagsView = ref(defaultSettings.tagsView)
  // 是否展示面包屑
  const breadcrumb = ref(defaultSettings.breadcrumb)
  // 是否显示侧边栏Logo
  const sidebarLogo = ref(defaultSettings.sidebarLogo)
  // 菜单是否折叠 toggle
  const sidebarCollapse = ref(defaultSettings.sidebarCollapse)
  // 登录用户水印
  const watermark = ref(defaultSettings.watermark)

  // 定义action
  const setIsMobile = (key) => {
    isMobile.value = key
  }
  const setLayout = (key) => {
    layout.value = key
  }
  const setTheme = (key) => {
    theme.value = key
  }
  const setThemeColor = (key) => {
    themeColor.value = key
  }
  const setThemeSize = (key) => {
    themeSize.value = key
  }

  const toggle = (key) => {
    switch (key) {
      case 'tagsView':
        tagsView.value = !tagsView.value
        break
      case 'breadcrumb':
        breadcrumb.value = !breadcrumb.value
        break
      case 'watermark':
        watermark.value = !watermark.value
        break
      case 'sidebarLogo':
        sidebarLogo.value = !sidebarLogo.value
        break
      case 'sidebarCollapse':
        sidebarCollapse.value = !sidebarCollapse.value
        break
    }
  }

  return {
    isMobile,
    layout,
    theme,
    themeColor,
    themeSize,
    tagsView,
    breadcrumb,
    sidebarLogo,
    sidebarCollapse,
    watermark,

    toggle,
    setIsMobile,
    setLayout,
    setTheme,
    setThemeColor,
    setThemeSize,
  }
})