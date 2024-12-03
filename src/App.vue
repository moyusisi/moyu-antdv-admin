<template>
  <a-config-provider>
    <div id="app" class="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped>
.app {
  /* overflow: hidden; */
  overflow: auto;
  border: none;
  /* background: #F6F7F8; */
}
</style>
