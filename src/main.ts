import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Antd from 'ant-design-vue'
import App from './App.vue'

// style
import 'ant-design-vue/dist/reset.css'
import '@/style/style.css'

const app = createApp(App);
app.use(createPinia())
app.use(router)
app.use(Antd)

// 挂载app
app.mount('#app')
