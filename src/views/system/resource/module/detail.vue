<template>
  <a-drawer
      :open="visible"
      title="资源权限详情"
      :width="drawerWidth"
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
        <a-card title="基本信息">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item name="parentCode" label="父编码" tooltip="父编码" >
                <span>{{ formData.parentCode }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="name" label="名称" tooltip="名称" >
                <span>{{ formData.name }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="code" label="编码" tooltip="编码" >
                <span>{{ formData.code }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="resourceType" label="资源类型（字" tooltip="资源类型（字典 1模块 2目录 3菜单 4内链 5外链 6按钮）" >
                <span>{{ formData.resourceType }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="path" label="路由地址" tooltip="路由地址" >
                <span>{{ formData.path }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="component" label="组件地址" tooltip="组件地址" >
                <span>{{ formData.component }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="permission" label="权限标识" tooltip="权限标识" >
                <span>{{ formData.permission }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="link" label="链接地址" tooltip="链接地址" >
                <span>{{ formData.link }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="icon" label="图标" tooltip="图标" >
                <span>{{ formData.icon }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="visible" label="是否可见（0" tooltip="是否可见（0不可见 1可见）" >
                <a-radio-group v-model:value="formData.visible" option-type="button" button-style="solid" disabled>
                  <a-radio :value="1">选项1</a-radio>
                  <a-radio :value="2">选项2</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="module" label="归属模块" tooltip="归属模块" >
                <span>{{ formData.module }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="sortNum" label="排序顺序" tooltip="排序顺序" >
                <span>{{ formData.sortNum }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="extJson" label="扩展信息" tooltip="扩展信息" >
                <span>{{ formData.extJson }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="remark" label="备注" tooltip="备注" >
                <span>{{ formData.remark }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="createTime" label="创建时间" tooltip="创建时间" >
                <span>{{ formData.createTime }}</span>
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
  import resourceApi from '@/api/system/resourceApi.js'

  import { useSettingsStore } from "@/store"

  // store
  const settingsStore = useSettingsStore()

  const emit = defineEmits({ successful: null })
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
    resourceApi.resourceDetail(param).then((res) => {
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
