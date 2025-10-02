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
          <span class="copy-btn"><a @click="copyCode"><CopyOutlined/> 复制</a></span>

<!--          <a-button size="small" type="dashed" ghost :icon="h(CopyOutlined)" @click="copyCode" class="copy-btn">复制</a-button>-->
          <highlightjs autodetect :code="code" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <template #footer>
      <a-flex gap="small" justify="flex-end">
        <a-button type="primary" danger @click="onClose"> 关闭</a-button>
        <a-button type="primary" ghost @click="downloadCode">写入本地</a-button>
        <a-button type="primary" :loading="submitLoading" @click="downloadCode">下载Zip</a-button>
      </a-flex>
    </template>
  </a-drawer>
</template>
<script setup>
import codegenApi from '@/api/dev/codegenApi'

import { h } from "vue";
import { CopyOutlined } from "@ant-design/icons-vue"
import { message } from 'ant-design-vue'
import { useSettingsStore } from "@/store/index.js"
// import downloadUtil from '@/utils/downloadUtil'

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
const submitLoading = ref(false)

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
const loadData = () => {
  dataLoading.value = true
  // 获取组织信息
  codegenApi.preview({ id: recordData.value.id }).then((res) => {
    previewData.value.codeMap = res.data
    previewData.value.activeTab = "entity.java"
  }).finally(() => {
    dataLoading.value = false
  })
}

// 复制代码
const copyCode = () => {
  const key = previewData.value.activeTab;
  const code = previewData.value.codeMap[key]
  navigator.clipboard.writeText(code).then(() => {
    message.success('复制成功')
  })
}

// 下载代码
const downloadCode = () => {
  if (!recordData.value.id) {
    message.warning("无法获取配置id，无法下载")
    return
  }
  let data = { ids: [recordData.value.id] }
  submitLoading.value = true
  codegenApi.download(data).then((res) => {
    emit('successful')
    onClose()
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    submitLoading.value = false
  })
}

// 对外暴露
defineExpose({
  onOpen,
})
</script>
<style scoped>

/** 复制样式 */
.copy-btn {
  float: right;
  top: 8px;
  right: 8px;
  position: absolute;
  z-index: 1;
}
.copy-btn a {
  color:#606266;
}
.copy-btn a:hover {
  color:#1677FF;
}
</style>
