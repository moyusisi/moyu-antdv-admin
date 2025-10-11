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
    <a-form ref="formRef" :model="formData" layout="vertical">
      <a-form-item name="name" label="显示名称" tooltip="按钮名称" required>
        <a-input v-model:value="formData.name" placeholder="请输入显示名称" allow-clear />
      </a-form-item>
      <a-form-item name="code" label="唯一编码" tooltip="不填将自动生成，创建后不可更改">
        <a-input v-model:value="formData.code" placeholder="唯一编码，不填将自动生成，创建后不可更改" :disabled="edit" allowClear/>
      </a-form-item>
      <a-form-item name="parentCode" label="上级菜单" tooltip="" required>
        <OrgTreeSelect :tree-data="treeData" :defaultValue="formData.parentCode" @onChange="parentChange"/>
      </a-form-item>
      <!-- 按钮:接口地址 -->
      <a-form-item name="path" label="接口地址" tooltip="按钮绑定的接口地址，以反斜杠'/'开头" required>
        <a-input v-model:value="formData.path" placeholder="请输入接口地址" allow-clear />
      </a-form-item>
      <!-- 按钮:权限标识 -->
      <a-form-item name="permission" label="权限标识" tooltip="对应接口的权限标识，如'sys:user:add'" required>
        <a-input v-model:value="formData.permission" placeholder="请输入权限标识" allow-clear/>
      </a-form-item>
      <a-form-item label="排序顺序" name="sortNum" tooltip="排序顺序" required>
        <a-input-number v-model:value="formData.sortNum" :max="100" style="width: 100%"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="onClose">关闭</a-button>
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
  import resourceApi from '@/api/sys/resourceApi.js'

  import { required } from '@/utils/formRules'
  import { message } from "ant-design-vue"
  import { useSettingsStore } from "@/store"
  import OrgTreeSelect from "@/views/sys/components/orgTreeSelect.vue"

  // store
  const settingsStore = useSettingsStore()

  const emit = defineEmits({ successful: null })
  // 默认是关闭状态
  const visible = ref(false)
  const title = ref()
  // 计算属性 抽屉宽度
  const drawerWidth = computed(() => {
    return 550
    // return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 是否为编辑
  const edit = ref(false)
  // 表单数据
  const formRef = ref()
  const formData = ref({
    resourceType: 6,
    sortNum: 99,
    status: 0
  })
  const dataLoading = ref(false)
  const submitLoading = ref(false)
  // 使用状态options（0正常 1停用）
  const statusOptions = [
    { label: "正常", value: 0 },
    { label: "已停用", value: 1 }
  ]
  const treeData = ref([])

  // 打开抽屉
  const onOpen = (row, module) => {
    visible.value = true
    if (row) {
      edit.value = true
      title.value = "编辑按钮"
      // 表单数据赋值
      loadData(row)
    } else {
      edit.value = false
      title.value = "新增按钮"
    }
    // 获取菜单树并加入顶级节点
    const moduleRes = resourceApi.menuTreeSelector({ module: module.code })
    treeData.value = [{
      code: module.code,
      name: module.name,
      children: moduleRes.data
    }]
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
    // 获取模块信息
    resourceApi.resourceDetail(param).then((res) => {
      formData.value = res.data
    }).finally(() => {
      dataLoading.value = false
    })
  }
  // 选择上级加载模块的选择框
  const parentChange = (value) => {
    formData.value.parentCode = value
  }

  // 验证并提交数据
  const onSubmit = () => {
    formRef.value.validate().then(() => {
      submitLoading.value = true
      // formData.value 加工处理 add/edit
      let fun = resourceApi.addResource
      if (edit.value) {
        fun = resourceApi.editResource
      }
      // add/edit 发送不同请求
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
