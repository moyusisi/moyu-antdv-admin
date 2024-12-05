<template>
  <a-layout>
    <!--  左侧侧边栏  -->
    <a-layout-sider :collapsed="false" :trigger="null" collapsible width="210" style="background: #fff">
      <SideBar />
    </a-layout-sider>
    <!-- 右侧布局 -->
    <a-layout>
      <div>
        头部
      </div>
      <!-- main区域  -->
      <a-layout-content class="main-content-wrapper">
        <div id="main">
          <router-view v-slot="{ Component }">
            <transition>
              <keep-alive :include="cachedViews">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
// 缓存页面集合
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/tagsView.ts'
import SideBar from '@/layout/Sidebar/index.vue'

const cachedViews = computed(() => useTagsViewStore().tagsView)

</script>

<style scoped>

</style>