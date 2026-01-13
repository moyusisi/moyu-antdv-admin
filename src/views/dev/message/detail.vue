<template>
  <a-drawer
      :open="visible"
      title="站内消息详情"
      :width="drawerWidth"
      :maskClosable="false"
      :closable="false"
      :destroy-on-close="true"
      @close="onClose"
  >
    <!--  上方操作区  -->
    <template #extra>
        <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <!--  数据区  -->
    <a-spin :spinning="dataLoading">
      <a-form ref="formRef" :model="formData" :label-col="{span: 6}">
        <a-card>
          <template #title>
            <span><RightSquareFilled style="color: dodgerblue;"/>基本信息</span>
          </template>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item name="code" label="唯一编码" tooltip="" >
                <span>{{ formData.code }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="messageType" label="消息类型" tooltip="" >
                <a-select v-model:value="formData.messageType" placeholder="消息类型" :options="exampleOptions" disabled allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="title" label="标题" tooltip="" required>
                <span>{{ formData.title }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="content" label="内容" tooltip="" required>
                <span>{{ formData.content }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="expireTime" label="过期时间" tooltip="过期时间" >
                <span>{{ formData.expireTime }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="sendBy" label="接收人" tooltip="接收人" >
                <span>{{ formData.sendBy }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </a-spin>
    <!--  底部操作区  -->
    <template #footer>
      <a-flex gap="small" justify="flex-end">
        <a-button type="primary" danger @click="onClose"> 关闭</a-button>
      </a-flex>
    </template>
  </a-drawer>
</template>
<script setup>
  import messageApi from '@/api/dev/messageApi.js'

  import { useSettingsStore } from "@/store"
  import { useRoute, useRouter } from "vue-router";

  // store
  const route = useRoute();
  const router = useRouter();
  const settingsStore = useSettingsStore()

  // 默认是关闭状态
  const visible = ref(false)
  // 计算属性 抽屉宽度
  const drawerWidth = computed(() => {
    return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 表单数据
  const formRef = ref()
  const formData = ref({})
  const dataLoading = ref(false)
  const submitLoading = ref(false)
  // 下拉框选项
  const exampleOptions = [
    { label: "选项一", value: 1 },
    { label: "选项二", value: 2 }
  ]

  // 打开抽屉
  const onOpen = (row) => {
    if (row) {
      // 表单数据赋值
      loadData(row)
    }
  }
  // 关闭抽屉
  const onClose = () => {
    formRef.value.resetFields()
    visible.value = false
  }

  // 加载数据
  const loadData = (row) => {
    dataLoading.value = true
    // 组装请求参数
    let param = { id: row.id }
    messageApi.messageDetail(param).then((res) => {
      formData.value = res.data
    }).finally(() => {
      dataLoading.value = false
      // 数据就绪之后显示
      visible.value = true
    })
  }

  // 调用这个函数将子组件的一些数据和方法暴露出去
  defineExpose({
    onOpen
  })
</script>

<style scoped>
  /** 后代选择器 **/
  .ant-card .ant-form-item {
    margin-bottom: 12px !important;
  }
</style>
