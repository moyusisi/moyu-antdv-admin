<!-- 侧边栏 -->
<template>
  <div>
    <!-- 侧边栏logo区 -->
    <SidebarLogo v-if="sidebarLogo" :collapse="sidebarCollapse"/>
    <!-- 侧边栏menu区   -->
    <div :class="sidebarCollapse ? 'admin-ui-side isCollapse' : 'admin-ui-side'">
      <div class="admin-ui-side-scroll">
        <SidebarMenu :menu-list="menuList"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SidebarLogo from '@/layout/Sidebar/SidebarLogo.vue'
import SidebarMenu from '@/layout/Sidebar/SidebarMenu.vue'
import { useSettingsStore } from '@/store/settings.ts'
import { useMenuStore } from '@/store/menu.ts'

const settingsStore = useSettingsStore();
const menuStore = useMenuStore();

const sidebarLogo = computed(() => settingsStore.sidebarLogo);
const sidebarCollapse = computed(() => settingsStore.sidebarCollapse);
const menuList = computed(() => menuStore.routes);

onMounted(() => {
  console.log("SideBar onMounted")
  menuStore.loadMenu()
})

</script>

<style scoped>

</style>