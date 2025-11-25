<template>
	<!-- 模块选择 -->
  <div class="module-content" v-if="moduleOpen">
    <a-menu v-if="moduleList && moduleList.length > 1"
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            class="module-menu"
    >
      <a-menu-item
          v-for="item in moduleList"
          :key="item.code"
          class="module-menu-item"
          @click="switchModule(item.code)"
          :class="{ 'ant-menu-item-select': item.code === module }"
      >
        <template #icon>
          <component :is="item.meta.icon" />
        </template>
        <span class="">{{ item.meta.title }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script setup>
  import { h, toRefs } from 'vue'
  import { useRoute, useRouter } from "vue-router";
  import { useMenuStore } from '@/store/index.js'

  const menuStore = useMenuStore()
  const route = useRoute()
  const router = useRouter()

  // 缓存页面集合, 直接解构store中的同名字段
  const { moduleList, module } = toRefs(menuStore);
  // module菜单是否打开
  const moduleOpen = ref(true)
  // 选中的module
  const selectedKeys = ref([])

  onMounted(() => {
    // 选中模块
    selectedKeys.value = [module.value]
  })

  // 切换模块
  const switchModule = (code) => {
    // 未变化不切换
    if (module.value === code) {
      return
    }
    // 路由到模块首页
    let moduleHome
    menuStore.moduleList.filter((item) => {
      if (item.code === code) {
        moduleHome = item.redirect
      }
    })
    // 模块首页
    if (!moduleHome) {
      moduleHome = "/index"
    }
    router.push({ path: moduleHome })
    // 路由到模块的首页
    menuStore.switchModule(code)
  }

</script>

<style scoped>

.module-menu {
  line-height: 50px;
  border-bottom: 0;
  width: 100%;
  flex: 0 0 auto;
}

/** 不显示选中的下划线 **/
:deep(.ant-menu-horizontal > .ant-menu-item::after,
.ant-menu-horizontal > .ant-menu-submenu::after) {
  display: none;
}
</style>
