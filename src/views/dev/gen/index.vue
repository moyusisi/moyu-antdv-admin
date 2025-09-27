<template>
  <a-card size="small">
    <a-form ref="searchFormRef" :model="searchFormData" layout="inline">
      <a-form-item name="searchKey" label="搜索关键词">
        <a-input v-model:value="searchFormData.searchKey" placeholder="请输入关键词" allowClear />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="tableRef.refresh(true)">查询</a-button>
          <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-card>
    <a-card size="small">
    <STable
        ref="tableRef"
        :columns="columns"
        :data="loadData"
        :alert="options.alert.show"
        bordered
        :row-key="(record) => record.id"
        :row-selection="options.rowSelection"
        :tool-config="toolConfig"
    >
            <template #operator>
        <a-space>
          <a-button type="primary" :icon="h(PlusOutlined)" @click="xx.onOpen(module)">从SQL导入</a-button>
          <a-button type="primary" :icon="h(CloudUploadOutlined)" @click="importFormRef.onOpen()">导入</a-button>
          <BatchDeleteButton icon="DeleteOutlined" :selectedRowKeys="selectedRowKeys" @batchDelete="batchDelete" />
        </a-space>
            </template>
            <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <span>{{ index + 1 }}</span>
        </template>
                <template v-if="column.dataIndex === 'action'">
                    <a-space>
            <a-tooltip title="预览代码">
              <a style="color:#53C61D;" @click="previewRef.onOpen(record)">预览</a>
            </a-tooltip>
            <a-tooltip title="下载生成的代码">
              <a style="color:#1980FF;" @click="configFormRef.onOpen(record)">生成</a>
            </a-tooltip>
                        <a-tooltip title="修改配置">
              <a @click="configFormRef.onOpen(record)">修改</a>
                        </a-tooltip>
            <a-tooltip title="根据表结构同步默认配置">
              <a @click="syncTable(record)">同步</a>
            </a-tooltip>
                        <a-tooltip title="删除配置">
                            <a-popconfirm title="确定要删除配置吗？" @confirm="deleteConfig(record)">
                                <a style="color:#FF4D4F;">删除</a>
                            </a-popconfirm>
                        </a-tooltip>
                    </a-space>
                </template>
            </template>
        </STable>
    </a-card>
  <ImportForm ref="importFormRef" @successful="tableRef.refresh(true)" />
  <ConfigForm ref="configFormRef" @successful="tableRef.refresh(true)" />
  <previewCode ref="previewRef" />
</template>

<script setup>
  import codegenApi from '@/api/dev/codegenApi'

  import { h } from "vue"
  import { PlusOutlined, CloudUploadOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import ConfigForm from "./configForm.vue"
  import ImportForm from "./importForm.vue"
  import previewCode from "./preview.vue"
  import { message } from "ant-design-vue";
  import STable from "@/components/STable/index.vue"
  import BatchDeleteButton from "@/components/BatchDeleteButton/index.vue";

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 50,
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      align: 'center',
      resizable: true,
      width: 150
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      align: 'center',
      resizable: true,
      width: 200
    },
    {
      title: '实体类名',
      dataIndex: 'entityName',
      align: 'center',
      resizable: true,
      width: 150
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 160
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 160
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      resizable: true,
      width: 200,
    }
  ]
  const selectedRowKeys = ref([])
  // 使用状态options（0正常 1停用）
  const statusOptions = [
    { label: "正常", value: 0 },
    { label: "已停用", value: 1 }
  ]
  // 列表选择配置
  const options = {
    alert: {
      show: false,
      clear: () => {
        selectedRowKeys.value = ref([])
      }
    },
    rowSelection: {
      onChange: (selectedRowKey, selectedRows) => {
        selectedRowKeys.value = selectedRowKey
      }
    }
  }
  // 定义tableDOM
  const tableRef = ref()
  const importFormRef = ref()
  const configFormRef = ref()
  const previewRef = ref()
  const toolConfig = { refresh: true, height: true, columnSetting: false, striped: false }
  const searchFormRef = ref()
  const searchFormData = ref({})

  // 表格查询 返回 Promise 对象
  const loadData = (parameter) => {
    let param = Object.assign(parameter, searchFormData.value)
    return codegenApi.configPage(param).then((res) => {
      return res.data
    })
  }
  // 重置
  const reset = () => {
    searchFormRef.value.resetFields()
    tableRef.value.refresh(true)
  }
  // 删除
  const deleteConfig = (record) => {
    let data = { ids: [record.id] }
    codegenApi.deleteConfig(data).then((res) => {
      message.success(res.message)
      tableRef.value.refresh(true)
    })
  }
  // 批量删除
  const batchDelete = (record) => {
    let data = { ids: selectedRowKeys.value }
    codegenApi.deleteConfig(data).then((res) => {
      message.success(res.message)
      tableRef.value.refresh(true)
    })
  }
  // 同步表
  const syncTable = (record) => {
    let data = { tableName: record.tableName }
    codegenApi.syncTable(data).then((res) => {
      // 添加之后重新加载数据
      message.success(res.message)
      tableRef.value.refresh(true)
    })
  }
</script>

<style scoped>
  /** 后代选择器 **/
  .ant-card-small .ant-form-inline {
    margin-bottom: -12px !important;
  }
   /** 直接后代选择器 **/
  .ant-form-inline > .ant-form-item {
        margin-bottom: 12px !important;
    }
</style>
