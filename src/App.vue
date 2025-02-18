<template>
  <a-config-provider :theme="{token: { borderRadius: 2 }}">
    <a-app id="app" class="app">
      <router-view />
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
