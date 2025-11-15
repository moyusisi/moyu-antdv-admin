<template>
  <a-drawer
    :open="visible"
    title="令牌列表"
    :width="drawerWidth"
    :closable="false"
    :footerStyle="{display: 'flex', justifyContent: 'flex-end'}"
    :destroy-on-close="true"
    @close="onClose"
  >
    <template #extra>
      <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <!-- 页面内容 -->
    <a-card size="small">
      <!-- 上方操作 -->
      <a-space wrap style="margin-bottom: 8px">
        <a-popconfirm :title=" '确定要批量强退这 ' + selectedRowKeys.length + ' 个令牌吗？' " :disabled ="selectedRowKeys.length < 1" @confirm="batchDelete">
          <a-button danger :icon="h(DeleteOutlined)" :disabled="selectedRowKeys.length < 1">
            批量强退
          </a-button>
        </a-popconfirm>
      </a-space>
      <a-table size="small"
               ref="tableRef"
               :columns="columns"
               :data-source="tableData"
               :row-key="(record) => record.account"
               :row-selection="rowSelection"
               bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'gender'">
            <a-tag v-if="record.gender === 1" color="blue">男</a-tag>
            <a-tag v-else-if="record.gender === 2" color="pink">女</a-tag>
            <a-tag v-else>未知</a-tag>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status === 0" color="green">正常</a-tag>
            <a-tag v-else>已停用</a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
          </template>
        </template>
      </a-table>
    </a-card>
  </a-drawer>
</template>

<script setup>
  import roleApi from '@/api/system/roleApi'

  import { message } from "ant-design-vue";
  import { h } from "vue";
  import { DeleteOutlined } from "@ant-design/icons-vue";
  import { useSettingsStore } from "@/store";
  import resourceApi from "@/api/system/resourceApi.js";

  const settingsStore = useSettingsStore()

  const columns = [
    {
      title: '姓名',
      dataIndex: 'tokenDevice',
      align: 'center',
      resizable: true,
      width: 100
    },
    {
      title: '登录设备',
      dataIndex: 'tokenDevice',
      align: "center",
      resizable: true,
      width: 150
    },
    {
      title: '有效期',
      dataIndex: 'tokenTimeout',
      align: "center",
      resizable: true,
      width: 150
    },
    {
      title: '令牌',
      dataIndex: 'tokenValue',
      align: "center",
      resizable: true,
      ellipsis: true,
      width: 150
    },
  ]

  // 默认是关闭状态
  const visible = ref(false)
  const record = ref()
  const emit = defineEmits({ successful: null })
  const searchFormData = ref({})
  // table数据
  const tableRef = ref()
  // 表格中的数据(loadTableData中会更新)
  const tableData = ref([])
  // 已选中的菜单(loadTableData中会更新)
  const selectedRowKeys = ref([])
  // 列表选择配置
  const rowSelection = ref({
    checkStrictly: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      selectedRowKeys.value = selectedKeys
      // console.log('onChange,selectedKeys:', selectedKeys);
    }
  });

  const drawerWidth = computed(() => {
    return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 打开抽屉
  const onOpen = (record) => {
    record.value = record;
    // 加载数据
    loadTableData()
    visible.value = true
  }
  // 关闭抽屉
  const onClose = () => {
    // 表单清空
    searchFormData.value = {}
    // table数据清空
    tableData.value = []
    selectedRowKeys.value = []
    // 关闭
    visible.value = false
  }

  // 表格查询
  const loadTableData = async () => {
    selectedRowKeys.value = []
    tableData.value = record.value.tokenList
  }
  // 批量强退
  const batchDelete = () => {
    if (selectedRowKeys.value.length < 1) {
      message.warning('请选择一条或多条数据')
      return
    }
    let data = { code: role.value.code, codeSet: selectedRowKeys.value }
    roleApi.roleDeleteUser(data).then((res) => {
      message.success(res.message)
      // 删掉之后重新加载数据
      loadTableData()
    })
  }
  // 调用这个函数将子组件的一些数据和方法暴露出去
  defineExpose({
    onOpen
  })
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 10px !important;
  }
  .selectorTree {
    max-height: 600px;
    overflow: auto;
  }
</style>
