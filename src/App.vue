<template>
  <a-config-provider>
    <a-app id="app" class="app">
      <router-view />
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app {
  /* overflow: hidden; */
  overflow: auto;
  border: none;
  /* background: #F6F7F8; */
}
</style>
