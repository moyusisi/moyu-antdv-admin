import service from '@/utils/request'

export default {
  // 表单登陆
  login(data) {
    return service.postForm('/api/auth/login', data)
  }
}