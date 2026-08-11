// 获取 app 的hash值
const getAppHash = (scripts) => {
	let appVersion = ''
	for (let i = 0; i < scripts.length; i++) {
		let src = scripts[i].getAttribute('src')
		if(src) {
			if (import.meta.env.DEV && src.includes('main.ts')) {
				// dev 开发环境，脚本地址为：/src/main.ts?t=1786427037744
				appVersion = src.split('t=')[1] || ''
			} else if (import.meta.env.PROD && src.includes('index-')) {
				// build 生产环境 脚本地址 = /index.hash.js (vite.config.ts中的entryFileNames配置)
				const match = src.match(/index\.(.+?)\.js/)
				appVersion = match ? match[1] : ''
			}
		}
	}
	return appVersion
}

// 获取本地的app.js的版本
export const getLocalVersion = () => {
	return getAppHash(document.getElementsByTagName('script'))
}

// 获取线上的app.js的版本
export const getOnlineVersion = () => {
	return new Promise((resolve, reject) => {
		// 加上时间戳，防止缓存
		fetch('/?t=' + Date.now()).then(async (res) => {
				let html = await res.text() // 转成字符串判断
				let doc = new DOMParser().parseFromString(html, 'text/html')
				let newVersion = getAppHash(doc.getElementsByTagName('script'))
				resolve(newVersion)
			})
			.catch((err) => {
				console.log('获取版本号失败', err)
				reject(err)
			})
	})
}
