<!-- 侧边栏菜单 -->
<template>
  <a-menu :openKeys="openKeys" :selectedKeys="selectedKeys" mode="inline" @select="onSelect" @openChange="onOpenChange">
    <div v-if="menuList.length <= 0" class="xn-pd20">
      <a-alert message="无任何菜单" type="info" :closable="false"/>
    </div>
    <template v-for="menu in menuList" :key="menu">
      <!-- 没有子菜单 -->
      <a-menu-item v-if="!hasChildren(menu) && !isHidden(menu)" :key="menu.path">
        <template v-if="menu.meta.icon">
          <component :is="menu.meta.icon"/>
        </template>
        <a v-if="menu.meta && menu.meta.type === 'link'">{{ menu.meta.title }}</a>
        <a v-else>{{ menu.meta.title }}</a>
      </a-menu-item>
      <!-- 有子菜单 -->
      <a-sub-menu v-else-if="!isHidden(menu)" :title="menu.meta.title">
        <template v-if="menu.meta.icon">
          <component :is="menu.meta.icon"/>
        </template>
        <SideBarMenu :menu-list="menu.children"/>
      </a-sub-menu>
    </template>
  </a-menu>

</template>

<script setup lang="ts">
import SideBarMenu from "@/layout/SideBar/SideBarMenu.vue"

const props = defineProps({
  openKeys: { type: Array, default: () => [] },
  selectedKeys: { type: Array, default: () => [] },
  menuList: {
    type: Array<any>,
    default: () => [],
    required: true
  },
})

const emit = defineEmits(['onSelect', 'onOpenChange'])
const onSelect = (obj) => {
  emit('onSelect', obj)
}
const onOpenChange = (keys) => {
  emit('onOpenChange', keys)
}

// 是否有子元素
const hasChildren = (item) => {
  return item.children && !item.children.every((item) => item.meta.hidden)
}

// 是否隐藏
const isHidden = (item) => {
  if (item.meta && item.meta.hidden === true) {
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