import Layout from '@/layout/index.vue'

/**
 * 静态路由
 * * path 要以"/"开头的绝对路径,children中的path也要写绝对路径
 */
const routes = [
	{
		path: '/',
		name: 'layout',
		component: Layout,
		redirect: '/index',
		meta: { title: '首页', hidden: false, alwaysShow: true, icon: 'home-outlined' },
		children: [
			{
				path: '/index',
				name: 'Index',
				component: () => import('@/views/hello/HelloWorld.vue'),
				meta: { title: '系统首页', icon: 'home-outlined' }
			}
		]
	},
	{
		path: '/hello',
		name: 'Hello',
		component: () => import('@/views/hello/HelloWorld.vue'),
		meta: { title: "Hello", hidden: true }
	},
	{
		path: '/404',
		component: () => import('@/views/other/404.vue'),
		meta: { hidden: true }
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/auth/login/login.vue'),
		meta: { title: '登录', hidden: true }
	},
	{
		path: '/404',
		component: () => import('@/views/other/404.vue'),
		meta: { hidden: true }
	}
]

export default routes
