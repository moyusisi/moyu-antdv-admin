<!-- 侧边栏菜单 -->
<template>
  <div v-if="menus.length <= 0" class="xn-pd20">
    <a-alert message="无任何菜单" type="info" :closable="false"/>
  </div>
  <template v-for="menu in menus" :key="menu">
    <!-- 没有子菜单 -->
    <a-menu-item v-if="!hasChildren(menu) & !isHidden(menu)" :key="menu.path">
      <template v-if="menu.meta.icon">
        <component :is="menu.meta.icon"/>
      </template>
      <a v-if="menu.meta && menu.meta.type === 'link'">{{ menu.meta.title }}</a>
      <a v-else>{{ menu.meta.title }}</a>
    </a-menu-item>
    <!-- 有子菜单 -->
    <a-sub-menu v-else-if="!isHidden(menu)" :key="menu.path" :title="menu.meta.title">
      <template v-if="menu.meta.icon">
        <component :is="menu.meta.icon"/>
      </template>
      <SideBarMenu :nav-menus="menu.children"/>
    </a-sub-menu>
  </template>
</template>

<script setup lang="ts">

const props = defineProps({
  menus: {
    type: Array,
    default: () => []
  }
})

// 是否有子元素
const hasChildren = (item) => {
  return item.children && !item.children.every((item) => item.meta.hidden)
}

// 是否隐藏
const isHidden = (item) => {
  if (item.meta.hidden === true) {
    return true
  }
  // 为空跟false，都会显示
  return false
}
</script>

<style scoped>

.xn-pd20 {
  padding: 20px;
}
</style>