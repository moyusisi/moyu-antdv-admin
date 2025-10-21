<template>
  <div class="admin-ui-main">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.path"/>
      </keep-alive>
    </router-view>
    <iframe-view/>
  </div>
</template>

<script setup>
import IframeView from "./iframeView.vue"
import { useTagsViewStore } from "@/store"

const route = useRoute()
const tagsViewStore = useTagsViewStore()

// 缓存页面集合
const cachedViews = computed(() => {
  // Proxy通过join(',')转为字符串数组
  return tagsViewStore.cachedViews.join(',')
})

</script>

<style scoped>

</style>
