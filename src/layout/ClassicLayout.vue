<template>
  <a-layout>
    <!--  左侧侧边栏  -->
    <Sidebar/>
    <!-- 右侧布局 -->
    <a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Sidebar from "@/layout/SideBar/index.vue";

const props = defineProps({
  layout: { type: String }, // 布局信息
  menuCollapse: { type: Boolean }, // 菜单是否折叠
  sysBaseConfig: { type: Object },
  openKeys: { type: Array },
  selectedKeys: { type: Array },
  menuList: { type: Array }, // 菜单
  breadcrumbOpen: { type: Boolean }, //面包屑
  tagsViewOpen: { type: Boolean },
  moduleMenuShow: { type: Boolean }
})

const emit = defineEmits(['onSelect', 'onOpenChange', 'switchModule', 'menuCollapseClick'])
const onSelect = (obj) => {
  emit('onSelect', obj)
}
const onOpenChange = (keys) => {
  emit('onOpenChange', keys)
}
</script>

<style scoped>

</style>