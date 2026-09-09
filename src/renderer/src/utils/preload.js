import { createApp } from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

const app = createApp({})
app.use(Loading)

let loader = null
function loaderStart() {
  loader = app.config.globalProperties.$loading.show({
    loader: 'spinner',
    color: '#5D00FF',
    zIndex: 999,
    canCancel: true
  })
}
function loaderEnd() {
  loader.hide()
}

function loaderContainerStart() {
  loader = app.config.globalProperties.$loading.show({
    loader: 'spinner',
    color: '#5D00FF',
    zIndex: 999,
    canCancel: true,
    isFullPage: false
  })
}

export default { loaderStart, loaderEnd, loaderContainerStart }
