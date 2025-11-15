import service from '@/utils/request'

export default {
  // 分页查询会话列表
  sessionPage(data) {
    return service.postJson('/api/auth/session/page', data)
  },
}