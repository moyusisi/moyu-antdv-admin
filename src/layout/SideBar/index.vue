<!-- 侧边栏 -->
<template>
  <a-layout-sider :collapsed="sidebarCollapse" :trigger="null" collapsible width="210">
    <!-- 侧边栏logo区 -->
    <SidebarLogo v-if="sidebarLogo" :collapse="sidebarCollapse"/>
    <!-- 侧边栏menu区   -->
    <div :class="sidebarCollapse ? 'admin-ui-side isCollapse' : 'admin-ui-side'">
      <div class="admin-ui-side-scroll">
        <SideBarMenu :menu-list="[]"/>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">

import { computed } from "vue"
import SideBarMenu from "@/layout/SideBar/SideBarMenu.vue"
import { useSettingsStore } from "@/store/settings.ts"

const settingsStore = useSettingsStore();

const sidebarLogo = computed(() => settingsStore.sidebarLogo);
const sidebarCollapse = computed(() => settingsStore.sidebarCollapse);

</script>

<style scoped>

</style>