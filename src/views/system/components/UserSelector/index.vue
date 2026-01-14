<template>
  <a-drawer
      v-model:open="visible"
      title="用户选择"
      :width="drawerWidth"
      :closable="false"
      :destroy-on-close="true"
      @close="onClose"
  >
    <template #extra>
      <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <!-- 页面内容 -->
    <a-row :gutter="8">
      <!-- 左侧组织树 -->
      <a-col :span="4">
        <OrgTree ref="treeRef" @onSelect="treeSelect"></OrgTree>
      </a-col>
      <a-col :span="10">
        <a-card size="small">
          <a-form ref="searchFormRef" :model="searchFormData">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item name="searchKey">
                  <a-input v-model:value="searchFormData.searchKey" placeholder="搜索用户名" allowClear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-space>
                  <a-button type="primary" :icon="h(SearchOutlined)" @click="loadData()">查询</a-button>
                  <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
                </a-space>
              </a-col>
              <a-col :span="8" style="text-align: right">
                <a-button @click="addRows" style="color: #52C41AFF; border-color: #52C41AFF">添加当前数据</a-button>
              </a-col>
            </a-row>
          </a-form>
          <a-table size="small"
               ref="tableRef"
               :columns="columns"
               :data-source="tableData"
               :row-key="(record) => record.account"
               :pagination="paginationRef"
               @change="handleTableChange"
               bordered>
            <template #bodyCell="{ column, record, index, text }">
              <template v-if="column.dataIndex === 'action'">
                <a-button type="dashed" size="small" @click="addRows(record)"><PlusOutlined /></a-button>
              </template>
              <template v-if="column.dataIndex === 'account'">
                <!-- 长文本省略提示 -->
                <a-tooltip :title="text" placement="topLeft">
                  <span>{{ text }}</span>
                </a-tooltip>
              </template>
              <template v-if="column.dataIndex === 'name'">
                <!-- 长文本省略提示 -->
                <a-tooltip :title="text" placement="topLeft">
                  <span>{{ text }}</span>
                </a-tooltip>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card size="small">
          <a-form ref="searchFormRef" :model="searchFormData">
            <a-row :gutter="16">
              <a-col :span="24" style="text-align: right">
                <a-form-item>
                  <a-button danger @click="delRows">全部清除</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <a-table size="small"
                   ref="tableRef"
                   :columns="columns"
                   :data-source="selectTableData"
                   :row-key="(record) => record.account"
                   :pagination="paginationRef"
                   @change="handleTableChange"
                   bordered>
            <template #bodyCell="{ column, record, index, text }">
              <template v-if="column.dataIndex === 'action'">
                <a-button type="dashed" danger size="small" @click="delRows(record)"><MinusOutlined /></a-button>
              </template>
              <template v-if="column.dataIndex === 'account'">
                <!-- 长文本省略提示 -->
                <a-tooltip :title="text" placement="topLeft">
                  <span>{{ text }}</span>
                </a-tooltip>
              </template>
              <template v-if="column.dataIndex === 'name'">
                <!-- 长文本省略提示 -->
                <a-tooltip :title="text" placement="topLeft">
                  <span>{{ text }}</span>
                </a-tooltip>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <!-- 底部内容 -->
    <template #footer>
      <a-flex gap="small" justify="flex-end">
        <a-button type="primary" danger @click="onClose"> 关闭</a-button>
      </a-flex>
    </template>
  </a-drawer>
</template>

<script setup>
  import roleApi from '@/api/system/roleApi'

  import { useSettingsStore } from "@/store";
  import { message } from "ant-design-vue";
  import { h } from "vue";
  import { PlusOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import userApi from "@/api/system/userApi"
  import OrgTree from "@/views/system/components/orgTree.vue";

  const settingsStore = useSettingsStore()

  const columns = [
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 50
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 200
    },
    {
      title: '账号',
      dataIndex: 'account',
      align: 'center',
      width: 200,
      ellipsis: true
    },
  ]

  // 默认是关闭状态
  const visible = ref(false)
  const role = ref()
  const emit = defineEmits({ successful: null })
  // 定义treeRef
  const treeRef = ref()
  // 表单数据
  const searchFormRef = ref()
  const searchFormData = ref({})
  // table数据
  const tableRef = ref()
  // 表格中的数据(loadData中会更新)
  const tableData = ref([])
  const selectTableData = ref([])
  // 已选中的菜单
  const selectedRowKeys = ref([])
  // 表格的分页配置
  const paginationRef = ref({
    // 当前页码
    current: 1,
    // 每页显示条数
    pageSize: 10,
    // 总条数，需要通过接口获取
    total: 0,
    // 显示总记录数
    showTotal: (total, range) => `共 ${total} 条 `,
    // 是否可改变每页显示条数
    showSizeChanger: true,
    onChange: (page, pageSize) => {
      // 处理分页切换的逻辑
      paginationRef.value.current = page
      paginationRef.value.pageSize = pageSize
    },
  })
  // 抽屉宽度
  const drawerWidth = computed(() => {
    return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 打开抽屉
  const onOpen = (record) => {
    role.value = record;
    // 加载数据
    loadData()
    visible.value = true
  }
  // 关闭抽屉
  const onClose = () => {
    visible.value = false
  }
  // 点击树查询
  const treeSelect = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      searchFormData.value.orgCode = selectedKeys.toString()
    } else {
      delete searchFormData.value.orgCode
    }
    loadData()
  }
  // 表格查询
  const loadData = async () => {
    selectedRowKeys.value = []
    let param = { pageNum: paginationRef.value.current, pageSize: paginationRef.value.pageSize }
    const res = await userApi.userPage(Object.assign(param, searchFormData.value))
    paginationRef.value.total = res.data.total
    tableData.value = res.data.records
  }
  // 分页、排序、筛选等操作变化时，会触发 change 事件
  const handleTableChange = (pagination, filters, sorter) => {
    let param = { pageNum: paginationRef.value.current, pageSize: paginationRef.value.pageSize }
    userApi.userPage(Object.assign(param, searchFormData.value)).then((res) => {
      paginationRef.value.total = res.data.total
      tableData.value = res.data.records
    })
  }
  // 重置
  const reset = () => {
    searchFormData.value = {}
    paginationRef.value.current = 1
    loadData()
  }
  // 添加记录
  const addRows = (record) => {
    if (record && record.account) {
      // 添加单行
      const selectedRecord = selectTableData.value.filter((item) => item.account === record.account)
      if (selectedRecord.length === 0) {
        selectTableData.value.push(record)
      } else {
        message.warning('该记录已存在')
      }
    } else {
      // 添加本页数据
      let newArray = []
      tableData.value.forEach((row) => {
        const index = selectTableData.value.findIndex(item => item.account === row.account);
        if (index === -1) {
          newArray.push(row)
        }
      })
      if (newArray.length === 0) {
        message.warning('这些记录已存在')
      } else {
        selectTableData.value.push(...newArray)
      }
    }
  }
  // 删减记录
  const delRows = (record) => {
    if (record && record.account) {
      // 删除单行
      // 1. 按唯一属性找索引
      const index = selectTableData.value.findIndex(item => item.account === record.account);
      // 2. 删除该对象
      if (index !== -1) {
        selectTableData.value.splice(index, 1);
      }
    } else {
      // 全删除
      selectTableData.value.length = 0
    }
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
