<template>
  <a-drawer
      :open="visible"
      :title="title"
      :width="drawerWidth"
      :closable="false"
      :footerStyle="{display: 'flex', justifyContent: 'flex-end'}"
      :destroy-on-close="true"
      @close="onClose"
  >
    <template #extra>
      <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <!-- 代码预览 -->
    <a-spin :spinning="dataLoading">
      <a-tabs v-model:activeKey="previewData.activeTab" type="card">
        <a-tab-pane v-for="(code, key) of previewData.codeMap" :key="key" :tab="key">
<!--          <highlightjs autodetect :code="code" />-->
          <pre><code class="" v-html="highlightedCode(code, key)" /></pre>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <template #footer>
      <a-space style="float:right;">
        <a-button type="primary" danger ghost @click="onClose"> 关闭</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script setup>
import codegenApi from '@/api/dev/codegenApi'

import { message } from 'ant-design-vue'
import { useSettingsStore } from "@/store/index.js";
// import downloadUtil from '@/utils/downloadUtil'
import hljs from 'highlight.js' // 导入代码高亮文件
import 'highlight.js/styles/github.css' // 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
// hljs.registerLanguage('vue', require('highlight.js/lib/languages/xml'))

const settingsStore = useSettingsStore()

const emit = defineEmits({ successful: null, closed: null })

// 默认是关闭状态
const visible = ref(false)
const title = ref()
const recordData = ref()
const previewData = ref({
  codeMap: Map,
  activeTab: "entity.java",
});
const dataLoading = ref(false)

// 抽屉宽度
const drawerWidth = computed(() => {
  return `calc(100%)`
  // return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
})

// 打开抽屉
const onOpen = (record) => {
  recordData.value = record;
  title.value = recordData.value.tableName + "-代码生成预览"
  // 加载数据
  loadData()
  visible.value = true
}
// 关闭抽屉
const onClose = () => {
  visible.value = false
}
// 加载数据
const loadData = async () => {
  dataLoading.value = true
  // 获取组织信息
  let res = await codegenApi.preview({ id: recordData.value.id })
  previewData.value.codeMap = res.data
  previewData.value.activeTab = "entity.java"
  dataLoading.value = false
}

/** 高亮显示 */
const highlightedCode = (code, key) => {
  let language = key.substring(key.indexOf('.') + 1, key.length)
  const result = hljs.highlight(code, { language: language, ignoreIllegals: true })
  return result.value
}

/** 复制代码成功 */
const clipboardSuccess = () => {
  message.success("复制成功")
}

// 下一步
const onSubmit = () => {
  onClose()
}

// 对外暴露
defineExpose({
  onOpen,
})
</script>
<style scoped>

</style>
