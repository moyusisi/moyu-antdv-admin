<template>
  <div v-if="route.meta.menuType === 5" class="admin-iframe">
    <iframe :key="route.meta.url" :src="route.meta.url"></iframe>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

</script>

<style scoped>

</style>
