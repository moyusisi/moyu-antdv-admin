<template>
  <!-- 系统设置Bar -->
  <div class="bar-item" @click="openSearch">
    <SearchOutlined />
  </div>
  <!-- 系统设置抽屉 -->
  <a-drawer v-model:open="searchOpen" :closable="false" width="500">
    <Search />
  </a-drawer>
</template>

<script setup lang="ts">
import { SearchOutlined } from "@ant-design/icons-vue";
import Search from "@/layout/components/NavBar/SearchBar/search.vue"

const searchOpen = ref(false)

// 搜索面板
const openSearch = () => {
  searchOpen.value = true
}
</script>

<style scoped>

</style>