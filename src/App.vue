<template>
  <a-config-provider :theme="{token: { borderRadius: 2 }}">
    <a-app id="app" class="app">
      <a-watermark :content="watermarkEnabled && userInfo ? [userInfo.name, userInfo.account] : undefined"
                   class="admin-ui-main">
        <router-view/>
      </a-watermark>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { useUserStore, useSettingsStore } from '@/store'
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()

  // 获取用户信息
  const userInfo = computed(() => {
    return userStore.userInfo
  })
  // 水印开关
  const watermarkEnabled = computed(() => {
    return settingsStore.watermarkEnabled
  })
</script>

<style scoped>

</style>
