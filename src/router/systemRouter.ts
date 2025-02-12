
/**
 * 静态路由
 * * path 要以"/"开头的绝对路径,children中的path也要写绝对路径
 */
const routes = [
	{
		path: '/',
		name: 'Hello',
		component: () => import('@/views/hello/HelloWorld.vue'),
		meta: { title: "Hello", hidden: true }
	},
	{
		path: '/404',
		component: () => import('@/views/other/404.vue'),
		meta: { hidden: true }
	}
]

export default routes
