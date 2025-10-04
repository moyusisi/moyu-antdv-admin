<template>
  <a-drawer
      :open="visible"
      :title="title"
      :width="drawerWidth"
      :closable="false"
      :maskClosable="false"
      :destroy-on-close="true"
      @close="onClose"
  >
        <template #extra>
        <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <a-spin :spinning="dataLoading">
      <a-card title="基本信息">
        <a-form ref="formRef" :model="formData" :label-col="{span: 6}">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item name="name" label="名称" tooltip="名称" required>
                <a-input v-model:value="formData.name" placeholder="名称" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="code" label="编码" tooltip="编码" >
                <a-input v-model:value="formData.code" placeholder="编码" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="orgCode" label="直属组织编码" tooltip="直属组织编码" >
                <a-input v-model:value="formData.orgCode" placeholder="直属组织编码" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="orgName" label="直属组织名称" tooltip="直属组织名称" >
                <a-input v-model:value="formData.orgName" placeholder="直属组织名称" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="dataScope" label="数据范围" tooltip="数据范围(字典 0无限制 1本人数据 2本机构 3本机构及以下 4自定义)" >
                <a-radio-group v-model:value="formData.dataScope" option-type="button" button-style="solid">
                  <a-radio :value="1">本人数据</a-radio>
                  <a-radio :value="2">本机构</a-radio>
                  <a-radio :value="3">本机构及以下</a-radio>
                  <a-radio :value="4">自定义</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="scopeSet" label="自定义scope" tooltip="自定义scope集合,逗号分隔" >
                <a-input v-model:value="formData.scopeSet" placeholder="自定义scope集合,逗号分隔" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="orgPath" label="组织机构层级" tooltip="组织机构层级路径,逗号分隔,父节点在后" >
                <a-input v-model:value="formData.orgPath" placeholder="组织机构层级路径,逗号分隔,父节点在后" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="sortNum" label="排序顺序" tooltip="排序顺序" >
                <a-input-number v-model:value="formData.sortNum" placeholder="排序顺序" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="status" label="状态" tooltip="状态（0正常 1停用）" >
                <a-radio-group v-model:value="formData.status" option-type="button" button-style="solid">
                  <a-radio :value="0">正常</a-radio>
                  <a-radio :value="1">停用</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="extJson" label="扩展信息" tooltip="扩展信息" >
                <a-textarea v-model:value="formData.extJson" placeholder="扩展信息" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="remark" label="备注" tooltip="备注" >
                <a-textarea v-model:value="formData.remark" placeholder="备注" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
    <template #footer>
      <a-flex gap="small" justify="flex-end">
        <a-button type="primary" danger @click="onClose"> 关闭</a-button>
        <a-button type="primary" :loading="submitLoading" @click="onSubmit">保存</a-button>
      </a-flex>
    </template>
  </a-drawer>
</template>
<script setup>
  import scopeApi from '@/api/system/scopeApi.js'

  import { required } from '@/utils/formRules'
  import { useSettingsStore } from "@/store";
  import { message } from "ant-design-vue"

  // store
  const settingsStore = useSettingsStore()

  const emit = defineEmits({ successful: null })
  // 默认是关闭状态
  const visible = ref(false)
  const title = ref()
  // 计算属性 抽屉宽度
  const drawerWidth = computed(() => {
    return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 表单数据
  const formRef = ref()
  const formData = ref({})
  const edit = ref(false)
  const dataLoading = ref(false)
  const submitLoading = ref(false)

  // 打开抽屉
  const onOpen = (row) => {
    visible.value = true
    if (row) {
      edit.value = true
    }
    if (edit.value) {
      title.value = "编辑分组信息"
      // 表单数据赋值
      loadData(row)
    } else {
      title.value = "新增分组信息"
    }
  }
  // 关闭抽屉
  const onClose = () => {
    formRef.value = {}
    visible.value = false
  }
  // 加载数据
  const loadData = (row) => {
    dataLoading.value = true
    // 组装请求参数
    let param = { id: row.id }
    scopeApi.scopeDetail(param).then((res) => {
      formData.value = res.data
    }).finally(() => {
      submitLoading.value = false
      dataLoading.value = false
    })
  }

  // 验证并提交数据
  const onSubmit = () => {
    formRef.value.validate().then(() => {
      submitLoading.value = true
      // formData.value 加工处理 TODO add edit
      let fun = scopeApi.addScope
      if (formData.value.id) {
        // 编辑
        fun = scopeApi.editScope
      }
      fun(formData.value).then((res) => {
        message.success(res.message)
        emit('successful')
        onClose()
      }).finally(() => {
        submitLoading.value = false
      })
    }).catch(() => {
    })
  }
  // 调用这个函数将子组件的一些数据和方法暴露出去
  defineExpose({
    onOpen
  })
</script>
<style scoped>
  .ant-form-item {
  }
</style>
