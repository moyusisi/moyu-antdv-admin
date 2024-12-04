/**
 * 系统默认配置
 */
const defaultSettings: AppSettings = {
  title: "moyu-antdv-admin",  // 标题
  version: "1.0.0",
  showSettings: true,
  tagsView: true,
  fixedHeader: false,  // 固定 Header
  sidebarLogo: true,   // 侧边栏logo
  layout: "classic",   // 整体布局方式 ['classic', 'topmenu'] 两种布局
  theme: "light",
  size: "default",
  language: "zh-cn",
  themeColor: "#409EFF",    // 默认主题色, 如果修改颜色不生效，请清理 localStorage
  watermarkEnabled: false,  // 水印
  watermarkContent: "moyusisi",

};

export default defaultSettings;
