import service from '@/utils/request'

/**
 * 代码生成相关接口
 */
export default {
	// 分页查询代码生成列表
	codePage(data) {
		return service.postJson('/api/gen/code/page', data)
	},
	// 分页查询代码生成实体配置表列表
	genTablePage(data) {
		return service.postJson('/api/gen/table/page', data)
	},
}
