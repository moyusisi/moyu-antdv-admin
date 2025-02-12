import service from '@/utils/request'

// 表单登陆
function login(data) {
  return service.postForm('/api/auth/login', data)
}