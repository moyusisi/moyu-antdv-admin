VisActor/VTable 组件说明
====

封装说明
----

>  本组件是在开源项目VisActor VTable的基础上进行封装处理， [官方版(Table)](https://visactor.com/vtable/guide/Getting_Started/Getting_Started) 。
>
> 使用分页时，无需在关注分页逻辑，仅需向 Table 组件传递绑定 `:data="Promise"` 对象即可
> 


例子1
----
（基础使用）

```vue

```

例子2
----

（简单的表格，最后一列是各种操作）

```vue

```



内置方法
----

通过 `声明的ref去调用 ==> tableRef.value` 调用

`tableRef.value.refresh(true)` 刷新列表 (用户新增/修改数据后，重载列表数据)

> 注意：要调用 `refresh(bool)` 需要给表格组件设定 `ref` 值
>
> `refresh()` 方法可以传一个 `bool` 值，当有传值 或值为 `true` 时，则刷新时会强制刷新到第一页（常用户页面 搜索 按钮进行搜索时，结果从第一页开始分页）


内置属性
----
> 除去 `a-table` 自带属性外，还而外提供了一些额外属性属性  


| 属性           | 说明                                            | 类型              | 默认值 |
| -------------- | ----------------------------------------------- | ----------------- | ------ |
| alert          | 设置是否显示表格信息栏                          | [object, boolean] | null   |
| showPagination | 显示分页选择器，可传 'auto' \| boolean          | [string, boolean] | 'auto' |
| data           | 加载数据方法 必须为 `Promise` 对象 **必须绑定**  | Promise           | -      |
| lineSelection  | 是否开启点击行高亮显示并选中                     | Boolean           | 'false'      |


`alert` 属性对象：

```javascript
alert: {
  show: Boolean, 
  clear: [Function, Boolean]
}
```

注意事项
----

> 你可能需要为了与后端提供的接口返回结果一致而去修改以下代码：
> (需要注意的是，这里的修改是全局性的，意味着整个项目所有使用该 table 组件都需要遵守这个返回结果定义的字段。)
>
> 文档中的结构有可能由于组件 bug 进行修正而改动。实际修改请以当时最新版本为准

修改 `@/components/table/index.js`  第 348 行起



```javascript
const data = reactive({
		needTotalList: [],
		localLoading: false,
		localDataSource: [],
		localPagination: Object.assign({}, props.pagination),
		isFullscreen: false,
		customSize: props.compSize,
		columnsSetting: [],
		localSettings: {
			rowClassName: props.rowClassName,
			rowClassNameSwitch: Boolean(props.rowClassName)
		}
	})

// 这里的 data.xxx 是之前声明的
// 在 loadData() 方法中去获取后端数据，进行一个数据的加载更新
result.then((r) => {
				if (r == null) {
					data.localLoading = false
					return
				}
				// 获取分页数据及分页的显示内容
				data.localPagination =
					(props.showPagination &&
						Object.assign({}, data.localPagination, {
							current: r.current, // pageNo, // 返回结果中的当前分页数
							total: r.total, // totalRows, // 返回结果中的总记录数
							showSizeChanger: props.showSizeChanger,
							pageSizeOptions: props.pageSizeOptions,
							showTotal: (total, range) => {
								return `${range[0]}-${range[1]} 共 ${total} 条 `
							},
							pageSize: (pagination && pagination.pageSize) || data.localPagination.pageSize
						})) ||
					false

				// 后端数据records为null保存修复
				if (r.records == null) {
					r.records = []
				}

				// 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
				if (r.records.length === 0 && props.showPagination && data.localPagination.current > 1) {
					data.localPagination.current--
					loadData()
					return
				}
				
				try {
					// 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
					// 没有数据或只有一页数据时隐藏分页栏
					// if ((['auto', true].includes(props.showPagination) && r.total <= (r.pages * data.localPagination.pageSize))) {
					// 	data.localPagination.hideOnSinglePage = true
					// }
					if (!props.showPagination) {
						data.localPagination.hideOnSinglePage = true
					}
				} catch (e) {
					data.localPagination = false
				}

				// if (props.showPagination === false) {
				// 	// 既然配置了不分页，那么我们这里接收到肯定是数组
				// 	console.log(r);
				// 	data.localDataSource = []
				// 	if (r instanceof Array) {
				// 		data.localDataSource = r
				// 	}
				// } else {
				// 	data.localDataSource = r.records
				// }

				// 返回结果中的数组数据
				data.localDataSource = r.records
				data.localLoading = false
				getTableProps()
			})
```
返回 JSON 例子：
```json
{
  "message": "",
  "result": {
    "data": [{
        id: 1,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        title: 'Alipay',
        description: '那是一种内在的东西， 他们到达不了，也无法触及的',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 2,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
        title: 'Angular',
        description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 3,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        title: 'Ant Design',
        description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 4,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
        title: 'Snowy',
        description: '那时候我只会想自己想要什么，从不想自己拥有什么',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 5,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
        title: 'Bootstrap',
        description: '凛冬将至',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 6,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
        title: 'Vue',
        description: '生命就像一盒巧克力，结果往往出人意料',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      }
    ],
    "pageSize": 10,
    "pageNo": 0,
    "totalPage": 6,
    "totalCount": 57
  },
  "status": 200,
  "timestamp": 1534955098193
}
```



更新时间
----

该文档最后更新于： 2023-12-27 PM 16:45
