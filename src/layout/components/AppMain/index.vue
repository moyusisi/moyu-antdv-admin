<template>
  <div id="admin-ui-main" class="admin-ui-main">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>
