// 系统配置
const DEFAULT_CONFIG = {
  // 首页地址
  DASHBOARD_URL: '/index',

  // 接口地址
  API_URL: import.meta.env.VITE_API_BASEURL,

  // 请求超时
  TIMEOUT: 5000,

  // TokenName // Authorization
  TOKEN_NAME: 'token',

  // Token前缀，注意最后有个空格，如不需要需设置空字符串 // Bearer
  TOKEN_PREFIX: '',

  // 追加其他头
  HEADERS: {},

  // 请求是否开启缓存
  REQUEST_CACHE: false,

  // 布局 经典：classical，顶栏菜单：top
  MOYU_LAYOUT: 'classic',

  // 是否开启多标签
  MOYU_LAYOUT_TAGS_OPEN: true,

  // 是否开启展示面包屑
  MOYU_BREADCRUMB_OPEN: false,

  // 菜单是否折叠
  MOYU_MENU_COLLAPSE: false,

  // 侧边菜单是否排他展开
  MOYU_MENU_UNIQUE_OPEN: true,

  // 模块坞
  MOYU_MODULE_UNFOLD_OPEN: true,

  // 登录用户水印
  MOYU_LOGIN_USER_WATERMARK_OPEN: false,

  // 页脚版权信息
  MOYU_FOOTER_COPYRIGHT_OPEN: false,

  // 默认整体主题
  MOYU_THEME: 'dark',

  // 主题颜色
  MOYU_THEME_COLOR: '#1677FF',

  // 整体表单风格
  MOYU_FORM_STYLE: 'drawer',

  // 系统基础配置，这些是数据库中保存起来的
  SYS_BASE_CONFIG: {
    // 默认logo
    MOYU_SYS_LOGO: '/img/logo.png',
    // 背景图
    MOYU_SYS_BACK_IMAGE: '',
    // 系统名称
    MOYU_SYS_NAME: 'MOYU',
    // 版权
    MOYU_SYS_COPYRIGHT: 'MOYU ©2024 Created by moyusisi',
    // 默认文件存储
    MOYU_SYS_DEFAULT_FILE_ENGINE: 'LOCAL',
    // 是否开启验证码
    MOYU_SYS_DEFAULT_CAPTCHA_OPEN: 'false'
  }
}

export default DEFAULT_CONFIG
