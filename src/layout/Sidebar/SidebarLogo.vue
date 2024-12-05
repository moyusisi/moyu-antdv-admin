<template>
  <div class="logo-container">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <router-link v-if="collapse" class="wh-full flex-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logo-image" />
      </router-link>

      <router-link v-else class="wh-full flex-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logo-image" />
        <span class="logo-title"> {{ defaultSettings.title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import defaultSettings from "@/config/settings.ts";
import { useSettingsStore } from "@/store/settings.ts";

const logo = ref(new URL(`@/assets/vue.svg`, import.meta.url).href);
const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

</script>

<style lang="css" scoped>

</style>
