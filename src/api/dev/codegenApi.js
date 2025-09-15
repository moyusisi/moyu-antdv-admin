import service from '@/utils/request'

/**
 * 角色相关接口
 */
export default {
	// 查询角色列表
	roleList(data) {
		return service.postJson('/api/sys/role/list', data)
	},
	// 分页查询角色列表
	genPage(data) {
		return service.postJson('/api/code/gen/page', data)
	},
}
