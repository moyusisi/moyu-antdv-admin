<!-- 侧边栏 -->
<template>
  <a-layout-sider
      v-if="!isMobile"
      :collapsed="menuCollapse"
      :trigger="null"
      collapsible
      :theme="sideTheme"
      width="210"
  >
    <header id="snowyHeaderLogo" class="snowy-header-logo">
      <div class="snowy-header-left">
        <div class="logo-bar">
          <img class="logo" :src="sysBaseConfig.SYS_BASE_CONFIG" />
          <span>{{ sysBaseConfig.SYS_BASE_CONFIG }}</span>
        </div>
      </div>
    </header>
    <div :class="menuCollapse ? 'admin-ui-side isCollapse' : 'admin-ui-side'">
      <div class="admin-ui-side-scroll">
        <a-menu
            v-bind:openKeys="openKeys"
            v-bind:selectedKeys="selectedKeys"
            :theme="sideTheme"
            mode="inline"
            @select="onSelect"
            @openChange="onOpenChange"
        >
          <NavMenu :nav-menus="menu" />
        </a-menu>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">

const props = defineProps({
  layout: { type: String }, // 布局信息
  isMobile: { type: Boolean }, // 是否移动端
  menuCollapse: { type: Boolean }, // 菜单是否折叠
  sideTheme: { type: String },
  sysBaseConfig: { type: Object },
  openKeys: { type: Array },
  selectedKeys: { type: Array },
  menu: { type: Array }, // 菜单
  breadcrumbOpen: { type: Boolean }, //面包屑
  layoutTagsOpen: { type: Boolean },
  kStore: { type: Object }, // 获取的仓库数据
  footerCopyrightOpen: { type: Boolean }, //页脚版权信息
  moduleMenuShow: { type: Boolean }
})

const emit = defineEmits(['onSelect', 'onOpenChange', 'switchModule', 'menuCollapseClick'])
const onSelect = (obj) => {
  emit('onSelect', obj)
}
const onOpenChange = (keys) => {
  emit('onOpenChange', keys)
}
const switchModule = (id) => {
  emit('switchModule', id)
}
const menuCollapseClick = () => {
  emit('menuCollapseClick')
}
</script>

<style scoped>

</style>