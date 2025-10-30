<template>
	<!-- 系统设置Bar -->
  <div class="setting panel-item" @click="openSetting">
    <LayoutOutlined />
  </div>
  <!-- 系统设置抽屉 -->
  <a-drawer v-model:open="settingDialog" :closable="false" width="300">
    <setting />
  </a-drawer>
</template>
<script setup>
	import { LayoutOutlined } from "@ant-design/icons-vue"
  import Setting from "@/layout/components/setting.vue"
  const settingDialog = ref(false)

  // 设置抽屉
  const openSetting = () => {
    settingDialog.value = true
  }
</script>

<style scoped>
  .setting {
    margin-right: 10px;
  }
	.panel-item {
		padding: 0 10px;
		cursor: pointer;
		height: 100%;
		display: flex;
		align-items: center;
		/*color: var(--font-color);*/
	}

	.panel-item:hover {
		background: var(--header-color-split);
	}
</style>
