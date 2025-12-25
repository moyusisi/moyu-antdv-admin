<template>
  <a-drawer
    title="角色授权-数据权限"
    :open="visible"
    :width="drawerWidth"
    :closable="false"
    :maskClosable="false"
    :destroy-on-close="true"
    @close="onClose"
  >
    <template #extra>
      <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <a-space style="margin-bottom: 10px;">
      <a-radio-group v-model:value="moduleId" button-style="solid">
        <a-radio-button v-for="module in moduleList" :key="module.code" :value="module.code" @click="moduleChange(module.code)">
          <component :is="module.icon" /> {{ module.name }}
        </a-radio-button>
      </a-radio-group>
    </a-space>
    <!-- 菜单权限授权表格 -->
    <a-table size="small" ref="tableRef"
             :columns="columns"
             :data-source="tableData"
             :loading="dataLoading"
             :row-key="(record) => record.code"
             :pagination="false"
             bordered>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'name'">
          <!-- 长文本省略提示 -->
          <a-tooltip :title="text" placement="topLeft">
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'code'">
          <!-- 唯一键点击查看详情 -->
          <a-tooltip :title="text" placement="topLeft">
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'path'">
          <a-tooltip :title="text" placement="topLeft">
            <a-tag v-if="record.path" :bordered="false">{{ record.path }}</a-tag>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'permission'">
          <a-tooltip :title="text" placement="topLeft">
            <a-tag v-if="record.permission" :bordered="false">{{ record.permission }}</a-tag>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'dataScope'">
          <a-flex vertical>
            <a-radio-group v-model:value="record.dataScope" option-type="button" button-style="solid">
              <!-- 数据范围(字典 1本人 2本机构 3本机构及以下 4自定义) -->
              <a-radio-button :value="0">不限制</a-radio-button>
              <a-radio-button :value="1">仅本人</a-radio-button>
              <a-radio-button :value="2">仅本机构</a-radio-button>
              <a-radio-button :value="3">本机构及以下</a-radio-button>
              <a-radio-button :value="4">自定义</a-radio-button>
            </a-radio-group>
            <OrgTreeSelect v-if="record.dataScope === 4" :tree-data="treeData" :defaultValue="record.scopeList" multiSelect @onChange="(value) => onScopeChange(value, record)"/>
          </a-flex>
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-flex gap="small" justify="flex-end">
        <a-button @click="onClose">关闭</a-button>
        <a-button type="primary" :loading="submitLoading" @click="onSubmit">保存</a-button>
      </a-flex>
    </template>
  </a-drawer>
</template>

<script setup>
  import resourceApi from "@/api/system/resourceApi.js";
  import roleApi from '@/api/system/roleApi'
  import { ref } from "vue";
  import { message } from "ant-design-vue";
  import { CloseOutlined, DeleteOutlined } from "@ant-design/icons-vue"
  import { useMenuStore } from '@/store/menu'
  import { useUserStore } from '@/store/user'
  import { useSettingsStore } from "@/store/settings";
  import OrgTreeSelect from "@/views/system/components/orgTreeSelect.vue";
  import userCenterApi from "@/api/system/userCenterApi.js";

  // store
  const settingsStore = useSettingsStore()
  const userStore = useUserStore()
  const menuStore = useMenuStore()

  // 抽屉参数
  const emit = defineEmits({ successful: null })
  const visible = ref(false)
  // 抽屉宽度
  const drawerWidth = computed(() => {
    return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 表单数据
  const roleCode = ref('')
  const moduleId = ref('')
  const dataLoading = ref(false)
  const submitLoading = ref(false)

  /***** 表格相关对象 start *****/
  const tableRef = ref()
  // 所有模块列表
  const moduleList = ref([])
  // 表格中的数据(loadData中会更新)
  const tableData = ref([])
  const scopeList = ref([])
  // 组织树
  const treeData = ref([])
  // 已选中的菜单(loadData中会更新)
  const selectedRowKeys = ref([])
  // 默认展开的行(loadData中会更新)
  const defaultExpandedRowKeys = ref([])
  // 表格列配置
  const columns = [
    {
      title: "接口名称",
      dataIndex: "name",
      align: "center",
      resizable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: "接口地址",
      dataIndex: "path",
      resizable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: "权限标识",
      dataIndex: "permission",
      resizable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: "数据范围",
      dataIndex: "dataScope",
      resizable: true,
      ellipsis: true,
      width: 400,
    },
  ]

  // 打开抽屉
  const onOpen = async (record) => {
    visible.value = true
    roleCode.value = record.code
    await initModuleList()
    await loadTreeData()
    // 再查询授权清单树
    loadData()
  }

  // 初始化
  const initModuleList = async () => {
    if (!moduleId.value) {
      // 若无moduleId, 则查询module列表第一个module的code作为默认moduleId
      const moduleRes = await resourceApi.moduleList()
      moduleList.value = moduleRes.data
      moduleId.value = moduleList.value[0]?.code
    }
  }

  // 加载左侧的树
  const loadTreeData = async () => {
    // 获取当前登陆者的orgTree 获取所有组织机构可使用orgApi.orgTree
    userCenterApi.loginUserOrgTree().then((res) => {
      if (res.data !== null) {
        treeData.value = res.data
      }
    })
  }

  // 加载数据
  const loadData = async (parameter) => {
    // 已有数据不重复查询
    if (moduleId.value) {
      // 菜单权限树
      dataLoading.value = true
      const res = await roleApi.dataScopeForGrant({ code: roleCode.value, module: moduleId.value })
      if(res.data) {
        res.data.forEach((record) => {
          if (record.scopeSet) {
            record.scopeList = record.scopeSet.split(',')
          } else {
            record.scopeList = []
          }
        })
      }
      tableData.value = res.data
      dataLoading.value = false
    }
  }

  // 通过应用分菜单
  const moduleChange = (value) => {
    moduleId.value = value
    loadData()
  }
  // 自定义数据范围变更
  const onScopeChange = (value, record) => {
    record.scopeList = value
  }

  // 关闭抽屉
  const onClose = () => {
    // 将这些缓存的给清空
    moduleId.value = ''
    moduleList.value = []
    tableData.value = []
    visible.value = false
  }

  // 验证并提交数据
  const onSubmit = () => {
    // 数据权限列表
    const dataScopeList = []
    tableData.value.forEach((record) => {
      const scopeInfo = { code: record.code, dataScope: record.dataScope }
      // <!-- 数据范围(字典 1本人 2本机构 3本机构及以下 4自定义) -->
      if (record.dataScope === 4 && record.scopeList) {
        scopeInfo.scopeSet = record.scopeList.join(',');
      } else {
        scopeInfo.scopeSet = null;
      }
      dataScopeList.push(scopeInfo)
    })
    const param = {
      code: roleCode.value,
      grantDataList: [...dataScopeList]
    }
    submitLoading.value = true
    roleApi.roleGrantData(param).then((res) => {
      message.success(res.message)
      refreshCache()
    }).finally(() => {
      submitLoading.value = false
    })
  }
  // 刷新缓存
  const refreshCache = () => {
    userStore.refreshUserInfo()
    menuStore.reloadRoutes()
  }
  // 调用这个函数将子组件的一些数据和方法暴露出去
  defineExpose({
    onOpen
  })
</script>

<style scoped>

</style>
