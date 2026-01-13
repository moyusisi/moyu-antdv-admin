<template>

  <a-modal
      v-model:open="visible"
      title="信息详情"
      :width="1000"
      :destroy-on-close="true"
      @cancel="onClose"
      @ok="onClose"
  >
    <!--  上方操作区  -->
    <template #closeIcon>
        <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <!--  数据区  -->
    <a-spin :spinning="dataLoading">
      <div style="text-align: center;font-size: 30px">{{ formData.title }}</div>
      <br>
      <div style="text-align: right;font-size: 12px">
        <span>发布时间：{{ formData.sendTime }} </span>
      </div>
      <a-divider style="margin-top: 5px"/>
      <div style="min-height: 300px">
        <span>{{ formData.content }} </span>
      </div>
    </a-spin>
    <!--  底部操作区  -->
<!--    <template #footer>-->
<!--      <a-flex gap="small" justify="flex-end">-->
<!--        <a-button type="primary" danger @click="onClose"> 关闭</a-button>-->
<!--      </a-flex>-->
<!--    </template>-->
  </a-modal>
</template>
<script setup>
  import messageApi from '@/api/dev/messageApi.js'

  // 默认是关闭状态
  const visible = ref(false)

  // 表单数据
  const formData = ref({})
  const dataLoading = ref(false)

  // 打开抽屉
  const onOpen = (row) => {
    if (row) {
      // 表单数据赋值
      loadData(row)
    }
  }
  // 关闭抽屉
  const onClose = () => {
    visible.value = false
  }

  // 加载数据
  const loadData = (row) => {
    dataLoading.value = true
    // 组装请求参数
    let param = { id: row.id }
    messageApi.readMessage(param).then((res) => {
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
</style>
