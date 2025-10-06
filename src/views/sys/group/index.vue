<template>
  <!-- 上方查询区 -->
  <a-card size="small">
    <a-form ref="queryFormRef" :model="queryFormData">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item name="orgCode" label="组织机构">
            <OrgTreeSelect ref="treeRef" @onChange="orgChange"/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="name" label="岗位名称">
            <a-input v-model:value="queryFormData.name" placeholder="搜索岗位名称" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="状态" name="status">
            <a-select v-model:value="queryFormData.status" placeholder="请选择状态" :options="statusOptions" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="querySubmit">查询</a-button>
            <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <a-card size="small">
    <!--  表格数据区  -->
    <MTable
        ref="tableRef"
        :columns="columns"
        :loadData="loadData"
        :row-key="(row) => row.id"
        showRowSelection
        @selectedChange="onSelectedChange"
    >
      <!--  表格上方左侧操作区  -->
      <template #operator>
        <a-space wrap style="margin-bottom: 6px">
          <a-button type="primary" :icon="h(PlusOutlined)" @click="addFormRef.onOpen(queryFormData.orgCode, treeRef.treeData)">新增</a-button>
          <a-popconfirm :title=" '确定要删除这 ' + selectedRowKeys.length + ' 条数据吗？' " :disabled ="selectedRowKeys.length < 1" @confirm="batchDelete">
            <a-button danger :icon="h(DeleteOutlined)" :disabled="selectedRowKeys.length < 1">
              批量删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'code'">
          <a-tag v-if="record.code" :bordered="false">{{ record.code }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'dataScope'">
          <!-- 数据范围(字典 0无限制 1本人数据 2本机构 3本机构及以下 4自定义) -->
          <a-tag v-if="record.dataScope === 1" color="orange">本人数据</a-tag>
          <a-tag v-if="record.dataScope === 2" color="cyan">本机构</a-tag>
          <a-tag v-if="record.dataScope === 3" color="blue">本机构及以下</a-tag>
          <a-tag v-if="record.dataScope === 4" color="purple">自定义</a-tag>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status === 0" color="green">正常</a-tag>
          <a-tag v-else>已停用</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a-tooltip title="分配角色">
              <a style="color:#1980FF;" @click="groupRoleRef.onOpen(record)"><DeploymentUnitOutlined /></a>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="分配用户">
              <a style="color:#53C61D;" @click="groupUserRef.onOpen(record, treeRef.treeData)"><UsergroupAddOutlined /></a>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="编辑">
              <a @click="editFormRef.onOpen(record, treeRef.treeData)"><FormOutlined /></a>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="删除">
              <a-popconfirm title="确定要删除吗？" @confirm="deleteGroup(record)">
                <a style="color:#FF4D4F;"><DeleteOutlined/></a>
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </MTable>
  </a-card>
  <EditForm ref="editFormRef" @successful="tableRef.refresh()" />
  <AddForm ref="addFormRef" @successful="tableRef.refresh()" />
  <GroupRole ref="groupRoleRef" @successful="handleSuccess()" />
  <GroupUser ref="groupUserRef" @successful="handleSuccess()" />
</template>

<script setup>
  import groupApi from '@/api/sys/groupApi'
  import { onMounted, h } from "vue";
  import { message } from 'ant-design-vue'
  import { PlusOutlined, DeleteOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue";
  import AddForm from './addForm.vue'
  import EditForm from './editForm.vue'
  import GroupRole from './groupRole.vue'
  import GroupUser from './groupUser.vue'
  import OrgTree from "../components/orgTree.vue"
  import MTable from "@/components/MTable/index.vue"
  import OrgTreeSelect from "@/views/sys/components/orgTreeSelect.vue"

  const columns = [
    {
      title: "岗位名称",
      dataIndex: "name",
      align: "center",
      resizable: true,
      width: 150,
    },
    {
      title: "所属组织机构",
      dataIndex: "orgName",
      align: "center",
      resizable: true,
      width: 200,
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
      align: "center",
      resizable: true,
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      resizable: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 160
    },
    {
      title: "修改时间",
      dataIndex: "updateTime",
      align: "center",
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 200,
    }
  ]
  const selectedRowKeys = ref([])
  // 使用状态options（0正常 1停用）
  const statusOptions = [
    { label: "正常", value: 0 },
    { label: "已停用", value: 1 }
  ]
  // 定义tableDOM
  const tableRef = ref()
  const toolConfig = { refresh: true, height: true, columnSetting: false, striped: false }
  const addFormRef = ref()
  const editFormRef = ref()
  const groupUserRef = ref()
  const groupRoleRef = ref()
  const queryFormRef = ref()
  const queryFormData = ref({})

  // 定义treeRef
  const treeRef = ref()

  // 提交查询
  const querySubmit = () => {
    tableRef.value.refresh(true)
  }
  // 重置
  const reset = () => {
    queryFormRef.value.resetFields()
    tableRef.value.refresh(true)
  }

  // 加载数据
  const loadData = (parameter) => {
    // 分页参数
    let param = Object.assign(parameter, queryFormData.value)
    return groupApi.groupPage(param).then((res) => {
      // res.data 为 {total, records}
      return res.data
    }).catch((err) => {
      console.error(err)
    })
  }
  // 选中行发生变化
  const onSelectedChange = (selectedKeys, selectedRows) => {
    selectedRowKeys.value = selectedKeys
    // console.log('onSelectedChange,selectedKeys:', selectedKeys);
  }

  // 组织机构变更
  const orgChange = (value) => {
    queryFormData.value.orgCode = value
  }
  // 点击树查询
  const treeSelect = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      queryFormData.value.orgCode = selectedKeys.toString()
    } else {
      delete queryFormData.value.orgCode
    }
    tableRef.value.refresh(true)
  }
  // 删除
  const deleteGroup = (record) => {
    let data = { ids: [record.id] }
    groupApi.deleteGroup(data).then((res) => {
      message.success(res.message)
      tableRef.value.refresh()
    })
  }
  // 批量删除
  const batchDelete = (record) => {
    if (selectedRowKeys.value.length < 1) {
      message.warning("请至少选择一条数据")
      return
    }
    let data = { ids: selectedRowKeys.value }
    groupApi.deleteGroup(data).then((res) => {
      message.success(res.message)
      tableRef.value.refresh()
    })
  }
  // 成功回调
  const handleSuccess = () => {
    querySubmit()
  }
</script>

<style scoped>
  /** 后代选择器 **/
  .ant-card .ant-form {
    margin-bottom: -12px !important;
  }
  .ant-form-item {
    margin-bottom: 12px !important;
  }
</style>