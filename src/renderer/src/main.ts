import { createApp } from 'vue'
import ElementPlus, { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/element-ui.css'

import App from './App.vue'
import store from './store'
import router from './router'
import * as helper from './utils/helper'
import * as config from './utils/config'
import * as common from './utils/common'
import constant from './utils/constant'
import client from './utils/client'
import uuid from './utils/uuid'

import './assets/main.css'
import './assets/style.css'
import './assets/fontawesome/css/all.min.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const app = createApp(App)

console.log('[Main] App instance created')
console.log('[Main] electronAPI available:', typeof window.electronAPI !== 'undefined')

if (typeof window.electronAPI === 'undefined') {
    console.error('[Main] FATAL: electronAPI not available! Preload script may have failed to load.')
}

app.config.errorHandler = (err, _instance, info) => {
    console.error('[Vue Error]', err, info)
}

helper.initApp()

app.use(store)
app.use(ElementPlus)
app.use(router)

console.log('[Main] Plugins registered (ElementPlus before router)')

app.config.globalProperties.$config = config
app.config.globalProperties.$common = common
app.config.globalProperties.$constant = constant
app.config.globalProperties.$helper = helper
app.config.globalProperties.$client = client
app.config.globalProperties.$uuid = uuid

app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$notify = ElNotification
app.config.globalProperties.$loading = ElLoading.service
app.config.globalProperties.$confirm = (message: string, title?: string, options?: object) =>
    ElMessageBox.confirm(message, title || 'Warning', options)
app.config.globalProperties.$alert = (message: string, title?: string, options?: object) =>
    ElMessageBox.alert(message, title || 'Alert', options)
app.config.globalProperties.$prompt = (message: string, title?: string, options?: object) =>
    ElMessageBox.prompt(message, title || 'Prompt', options)

app.config.globalProperties.$userStore = () => store
app.config.globalProperties.$userId = () => store.state.user?.user_id || store.state.user?.id
app.config.globalProperties.$user = () => store.state.user
app.config.globalProperties.$selectedAsset = () => store.state.selectedAsset

console.log('[Main] Mounting app to #app...')
app.mount('#app')
console.log('[Main] App mounted successfully')