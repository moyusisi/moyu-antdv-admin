<template>
	<a-card size="small" v-if="indexShow">
		<a-form ref="searchFormRef" :model="searchFormData">
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item name="searchKey" label="搜索关键词">
						<a-input v-model:value="searchFormData.searchKey" placeholder="请输入关键词" allowClear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-space>
						<a-button type="primary" :icon="h(SearchOutlined)" @click="tableRef.refresh(true)">查询</a-button>
						<a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
					</a-space>
				</a-col>
			</a-row>
		</a-form>
	</a-card>
	<a-card size="small" v-if="indexShow">
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
					<a-button type="primary" :icon="h(PlusOutlined)" @click="openConfig()">新增配置</a-button>
					<BatchDeleteButton icon="DeleteOutlined" :selectedRowKeys="selectedRowKeys" @batchDelete="deleteBatchRole" />
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'code'">
					<a-tag v-if="record.code" :bordered="false">{{ record.code }}</a-tag>
				</template>
				<template v-if="column.dataIndex === 'status'">
					<a-tag v-if="record.status === 0" color="green">正常</a-tag>
					<a-tag v-else>已停用</a-tag>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
<!--            <template #split>-->
<!--              <a-divider type="vertical" />-->
<!--            </template>-->
            <a-tooltip title="预览">
              <a style="color:#1980FF;" @click="grantMenuFormRef.onOpen(record)">预览</a>
            </a-tooltip>
            <a-tooltip title="生成">
              <a style="color:#53C61D;" @click="roleUserRef.onOpen(record)">生成</a>
            </a-tooltip>
						<a-tooltip title="配置">
<!--              <a @click="editFormRef.onOpen(record)">配置</a>-->
              <a @click="openConfig(record)">配置</a>
						</a-tooltip>
						<a-tooltip title="删除">
							<a-popconfirm title="确定要删除吗？" @confirm="deleteRole(record)">
								<a style="color:#FF4D4F;">删除</a>
							</a-popconfirm>
						</a-tooltip>
					</a-space>
				</template>
			</template>
		</STable>
	</a-card>
  <steps v-else ref="stepsRef" @successful="tableRef.refresh(true)" @closed="configClosed()" />
<!--	<AddForm ref="addFormRef" @successful="tableRef.refresh()" />-->
<!--	<EditForm ref="editFormRef" @successful="tableRef.refresh()" />-->
</template>

<script setup>
	import roleApi from '@/api/sys/roleApi'
  import codegenApi from '@/api/dev/codegenApi'

	import { h } from "vue"
	import { PlusOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import steps from "./steps.vue"
	// import AddForm from "./addForm.vue";
	// import EditForm from "./editForm.vue";
	import { message } from "ant-design-vue";
  import BatchDeleteButton from "@/components/BatchDeleteButton/index.vue"
  import STable from "@/components/STable/index.vue"

	const columns = [
		{
			title: '表名',
			dataIndex: 'tableName',
			resizable: true,
			width: 150
		},
		{
			title: '描述',
			dataIndex: 'tableComment',
			resizable: true,
			width: 200
		},
		{
			title: '存储引擎',
			dataIndex: 'engine',
			align: 'center',
			width: 100
		},
		{
			title: '排序规则',
			dataIndex: 'tableCollation',
			align: 'center',
			width: 150
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
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
	const formRef = ref()
  const indexShow = ref(true)
  const stepsRef = ref()
  const addFormRef = ref()
	const editFormRef = ref()
  const module = ref()
	const toolConfig = { refresh: true, height: true, columnSetting: false, striped: false }
	const grantMenuFormRef = ref()
  const roleUserRef = ref()
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
	const deleteRole = (record) => {
		let data = { ids: [record.id] }
		roleApi.deleteRole(data).then((res) => {
			message.success(res.message)
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchRole = (params) => {
		let data = { ids: selectedRowKeys.value }
		roleApi.deleteRole(data).then((res) => {
			message.success(res.message)
			tableRef.value.clearRefreshSelected()
		})
	}

  // 打开配置界面
  const openConfig = (record) => {
    indexShow.value = false
    nextTick(() => {
      stepsRef.value.configSteps(record)
    })
  }
  // 关闭配置界面
  const configClosed = () => {
    indexShow.value = true
  }
</script>

<style scoped>
	.ant-form-item {
		margin-bottom: 0 !important;
	}
</style>
