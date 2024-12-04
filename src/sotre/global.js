import { ref } from "vue"
import { defineStore } from "pinia"
import config from "@/config"


export const useGlobalStore
  = defineStore('global', () => {

  // 定义state
  // 用户信息
  const userInfo = ref({})
  // 移动端布局
  const isMobile = ref(false)
  // 布局
  const layout = ref(config.MOYU_LAYOUT)
  // 多标签栏
  const layoutTagsOpen = ref(config.MOYU_LAYOUT_TAGS_OPEN)
  // 是否展示面包屑
  const breadcrumbOpen = ref(config.MOYU_BREADCRUMB_OPEN)
  // 菜单是否折叠 toggle
  const menuCollapse = ref(config.MOYU_MENU_COLLAPSE)
  // 侧边菜单是否排他展开
  const menuUniqueOpen = ref(config.MOYU_MENU_UNIQUE_OPEN)
  // 模块坞
  const moduleUnfoldOpen = ref(config.MOYU_MODULE_UNFOLD_OPEN)
  // 登录用户水印
  const loginUserWatermarkOpen = ref(config.MOYU_LOGIN_USER_WATERMARK_OPEN)
  // 页脚版权信息
  const footerCopyrightOpen = ref(config.MOYU_FOOTER_COPYRIGHT_OPEN)
  // 主题
  const theme = ref(config.MOYU_THEME)
  // 主题颜色
  const themeColor = ref(config.MOYU_THEME_COLOR)
  // 整体表单风格
  const formStyle = ref(config.MOYU_FORM_STYLE)
  // 系统配置
  const sysBaseConfig = ref(config.SYS_BASE_CONFIG)

  // 定义action
  const setUserInfo = (key) => {
    userInfo.value = key
  }
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
  const toggleConfig = (key) => {
    switch (key) {
      case 'menuCollapse':
        menuCollapse.value = !menuCollapse.value
        break
      case 'menuUniqueOpen':
        menuUniqueOpen.value = !menuUniqueOpen.value
        break
      case 'layoutTagsOpen':
        layoutTagsOpen.value = !layoutTagsOpen.value
        break
      case 'breadcrumbOpen':
        breadcrumbOpen.value = !breadcrumbOpen.value
        break
      case 'loginUserWatermarkOpen':
        loginUserWatermarkOpen.value = !loginUserWatermarkOpen.value
        break
      case 'footerCopyrightOpen':
        footerCopyrightOpen.value = !footerCopyrightOpen.value
        break
      case 'moduleUnfoldOpen':
        moduleUnfoldOpen.value = !moduleUnfoldOpen.value
        break
    }
  }
  const setFormStyle = (key) => {
    formStyle.value = key
  }
  const setSysBaseConfig = (key) => {
    sysBaseConfig.value = key
  }
  return {
    userInfo,
    isMobile,
    layout,
    layoutTagsOpen,
    breadcrumbOpen,
    menuCollapse,
    menuUniqueOpen,
    moduleUnfoldOpen,
    loginUserWatermarkOpen,
    footerCopyrightOpen,
    theme,
    themeColor,
    formStyle,
    sysBaseConfig,

    setUserInfo,
    setIsMobile,
    setLayout,
    setTheme,
    setThemeColor,
    toggleConfig,
    setFormStyle,
    setSysBaseConfig
  }
})