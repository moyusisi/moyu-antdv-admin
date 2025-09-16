<template>
  <a-form ref="formRef" :model="formData" :label-col="{span: 4}">
    <a-row :gutter="24">
      <a-col :span="10" :offset="2">
        <a-form-item label="表名" name="tableName" :rules="[required('请输入表名')]">
          <a-input v-model:value="formData.tableName" placeholder="如:sys_user"/>
        </a-form-item>
      </a-col>
      <a-col :span="10">
        <a-form-item label="业务名" name="businessName" :rules="[required('请输入业务名')]">
          <a-input v-model:value="formData.businessName" placeholder="如:用户"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="10" :offset="2">
        <a-form-item label="包名" name="packageName" :rules="[required('请输入包名')]">
          <a-input v-model:value="formData.packageName" placeholder="如:com.moyu.boot"/>
        </a-form-item>
      </a-col>
      <a-col :span="10">
        <a-form-item label="模块名" name="moduleName" :rules="[required('请输入模块名')]">
          <a-input v-model:value="formData.moduleName" placeholder="如:system"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="10" :offset="2">
        <a-form-item label="实体名" name="entityName" :rules="[required('请输入实体名')]">
          <a-input v-model:value="formData.entityName" placeholder="如:User"/>
        </a-form-item>
      </a-col>
      <a-col :span="10">
        <a-form-item label="作者" name="author">
          <a-input v-model:value="formData.author" placeholder="如:moyusisi"/>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import roleApi from '@/api/sys/roleApi'

import { required } from '@/utils/formRules'
import { message } from "ant-design-vue";
import OrgTreeSelect from "@/views/sys/components/orgTreeSelect.vue";

// 定义emit事件
const emit = defineEmits({ successful: null })
// 默认是关闭状态
const visible = ref(false)
const formRef = ref()
// 表单数据，这里有默认值
const formData = ref({
  sortNum: 1,
  status: 0
})
const submitLoading = ref(false)
// 使用状态options（0正常 1停用）
const statusOptions = [
  { label: "正常", value: 0 },
  { label: "已停用", value: 1 }
]
// 打开抽屉
const onOpen = (moduleCode) => {
  visible.value = true
  if (moduleCode) {
    formData.value.module = moduleCode
  }
}
// 关闭抽屉
const onClose = () => {
  visible.value = false
}
// 验证并提交数据
const onSubmit = () => {
  formRef.value.validate().then(() => {
    submitLoading.value = true
    roleApi.addRole(formData.value).then((res) => {
      message.success(res.message)
      onClose()
      emit('successful')
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
