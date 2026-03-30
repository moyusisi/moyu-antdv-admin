import type { App } from "vue";

import VxeUIBase, { VxeUI } from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx'
import ExcelJS from 'exceljs'

function configVxe() {
  // VxeUI 是 Vxe 库通用全局实例（也可以使用旧别名 VXETable）
  VxeUI.setConfig({
    size: "medium",
    pager: {
      perfect: true,
      // 每页大小，默认 10
      pageSize: 10,
      pagerCount: 7,
      // 每页大小选项列表
      pageSizes: [10, 20, 50, 100],
      layouts: [
        "Total",
        "Home",
        "PrevPage",
        "Number",
        "NextPage",
        "End",
        "Sizes",
      ],
    },
    grid: {
      border: true,
      // 所有的列对齐方式
      align: "center",
      // 当内容过长时显示为省略号
      showOverflow: "tooltip",
      // 行配置信息
      rowConfig: {
        useKey: true,
        // 自定义行数据唯一主键的字段名
        keyField: "id",
        // 当鼠标点击行时，是否要高亮当前行
        isCurrent: true,
      },
      // 分页配置项
      pagerConfig: {
        enabled: true
      },
      // 数据代理配置
      proxyConfig: {
        // 获取响应的值配置
        response: {
          // 只对 pager-config 配置时有效，响应结果中获取数据列表的属性（分页场景）
          result: "records",
          // 只对 pager-config 配置时有效，响应结果中获取分页的属性（分页场景）
          total: "total",
        },
      },
      // 列配置信息
      columnConfig: {
        // 每一列是否启用列宽拖动
        resizable: true,
      },
      // 列字段
      exportConfig: {
        type: "xlsx",
        sheetName: "sheet1",
      },
      // 个性化信息配置项
      customConfig: {
        immediate: true,
      },
      // 工具栏配置
      toolbarConfig: {
        // 是否显示个性化列配置
        custom: true,
        // 是否允许最大化显示
        zoom: true,
        // 刷新按钮配置
        refresh: true,
        // 导出按钮配置（需要设置 "export-config"）
        export: true,
        //插槽
        slots: {
          // 按钮列表
          buttons: "operator",
        },
      },
    }
  });
}

// 全局注册 vxeTable
export function setupVxeTable(app: App<Element>) {
  configVxe()
  // 导入导出excel格式文件插件
  VxeUI.use(VxeUIPluginExportXLSX, {
    ExcelJS
  })
  app.use(VxeUIBase)
  app.use(VxeUITable)
}