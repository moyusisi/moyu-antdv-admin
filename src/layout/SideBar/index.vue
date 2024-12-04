<!-- 侧边栏 -->
<template>
  <a-layout-sider
      :collapsed="menuCollapse"
      :trigger="null"
      collapsible
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
            mode="inline"
            @select="onSelect"
            @openChange="onOpenChange"
        >
          <SideBarMenu :menu-list="menuList" />
        </a-menu>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">

import SideBarMenu from "@/layout/SideBar/SideBarMenu.vue";

const props = defineProps({
  menuCollapse: { type: Boolean }, // 菜单是否折叠
  sysBaseConfig: { type: Object },
  openKeys: { type: Array },
  selectedKeys: { type: Array },
  menuList: { type: Array }, // 菜单
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