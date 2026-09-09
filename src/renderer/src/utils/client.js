import axios from 'axios'
import store from '@/store'
import route from '@/router'
import qs from 'qs'

const client = axios.create({
  withCredentials: false
})

// Best & safe: when running in Electron, route ALL service API via main process (Node http)
// to bypass webSecurity:true CORS (prod file:// and dev localhost:8080). Keeps webSecurity:true secure.
// Uses apiProxy IPC (src/main/ipcmain/apiProxy) — same pattern as authRequest.
const originalAdapter = axios.defaults.adapter
client.defaults.adapter = async (config) => {
  const hasApiIPC =
    typeof window !== 'undefined' && window.electronAPI && window.electronAPI.apiRequest
  if (hasApiIPC) {
    let url = config.url || ''
    const base = config.baseURL || client.defaults.baseURL || ''
    if (base && !url.startsWith('http')) {
      url = `${String(base).replace(/\/$/, '')}/${String(url).replace(/^\//, '')}`
    } else if (!url.startsWith('http') && client.defaults.baseURL) {
      url = `${String(client.defaults.baseURL).replace(/\/$/, '')}/${String(url).replace(/^\//, '')}`
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const api = window.electronAPI.apiRequest
      const result = await api({
        method: config.method ? config.method.toUpperCase() : 'GET',
        url,
        headers: config.headers,
        data: config.data,
        params: config.params,
        timeout: config.timeout || 20000
      })
      if (result.success) {
        return {
          data: result.data,
          status: result.status || 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        }
      }
      const err = new Error(result.message || 'Network Error')
      err.response = {
        data: result.data,
        status: result.status,
        headers: {},
        config,
        statusText: ''
      }
      err.config = config
      return Promise.reject(err)
    }
  }
  return originalAdapter(config)
}

let interceptorAuthenticate = null

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const refreshToken = () => {
  const refreshTokenValue = localStorage.getItem('refresh_token')
  if (!refreshTokenValue) {
    return Promise.reject(new Error('No refresh token available'))
  }

  const domain = localStorage.getItem('LOGIN_ADDR') || ''
  const hasAuthIPC = typeof window !== 'undefined' && window.electronAPI && window.electronAPI.authRequest
  const isViteProxy =
    !hasAuthIPC &&
    typeof window !== 'undefined' &&
    window.location &&
    window.location.port === '8080' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  // Chỉ dùng proxy khi không có Electron IPC (web thuần); Electron dùng absolute qua Node axios
  const refreshUrl = isViteProxy
    ? '/oauth/token'
    : domain
      ? `${domain.replace(/\/$/, '')}/oauth/token`
      : '/oauth/token'
  const basicAuth = 'Basic ' + btoa('tester-client:tester-client')

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: basicAuth
  }
  const body = qs.stringify({
    refresh_token: refreshTokenValue,
    grant_type: 'refresh_token'
  })

  // Chạy request qua main process (Node http, không bị CORS/preflight của renderer chi phối)
  // thay vì gọi thẳng axios trong renderer, vì webSecurity: true bật CORS như trình duyệt thật.
  const request =
    window.electronAPI && window.electronAPI.authRequest
      ? window.electronAPI.authRequest({ url: refreshUrl, data: body, headers }).then((result) => {
          if (result.success) {
            return { data: result.data }
          }
          return Promise.reject({
            response: { status: result.status, data: result.data },
            message: result.message
          })
        })
      : axios.post(refreshUrl, body, { headers })

  return request.then((response) => {
    const { access_token, refresh_token } = response.data

    localStorage.setItem('token', access_token)
    localStorage.setItem('refresh_token', refresh_token)

    store.commit('SET_TOKEN', access_token)

    return access_token
  })
}

client.interceptors.request.use(
  function (config) {
    if (!store.state.serviceAddr && !config.url.startsWith('http')) {
      return Promise.reject(new Error('Server address not configured'))
    }

    // Vite proxy (dev): when running on localhost:8080, route via proxy to avoid CORS
    // Do not send absolute http://103... URL directly — rewrite to relative /api so Vite proxies
    const isViteProxy =
      typeof window !== 'undefined' &&
      window.location &&
      window.location.port === '8080' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    if (isViteProxy && config.baseURL) {
      const base = String(config.baseURL).replace(/\/$/, '')
      if (config.url.startsWith(base)) {
        config.url = config.url.slice(base.length) || '/'
      }
      // Force same-origin via Vite proxy
      config.baseURL = ''
    } else if (isViteProxy && client.defaults.baseURL && !config.url.startsWith('http')) {
      // Relative URL + absolute baseURL would become absolute — suppress baseURL for proxy
      config.baseURL = ''
    }

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  function (response) {
    const res = response.data

    if (res && res.success === true) {
      return res.data
    }

    if (res && res.success === false) {
      console.error(res.message)
      return Promise.reject(new Error(res.message))
    }

    if (res && res.error) {
      const errorMsg = res.error_description || res.error
      console.error(errorMsg)
      if (res.error === 'invalid_token' || res.error === 'token_expired') {
        return Promise.reject({
          response: {
            status: 401,
            data: { message: errorMsg }
          }
        })
      }
      return Promise.reject(new Error(errorMsg))
    }

    return res
  },
  function (error) {
    if (error.response) {
      if (error.response.status === 401) {
        const originalRequest = error.config

        if (originalRequest.url.includes('/oauth/token')) {
          if (typeof window !== 'undefined' && window.$helper && window.$helper.afterLogout) {
            window.$helper.afterLogout()
          }
          route.push({ name: 'login' }).catch(() => {})
          return Promise.reject(error)
        }

        if (!originalRequest._retry) {
          originalRequest._retry = true

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return client(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          isRefreshing = true

          return refreshToken()
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`

              processQueue(null, token)

              return client(originalRequest)
            })
            .catch((err) => {
              processQueue(err, null)
              if (typeof window !== 'undefined' && window.$helper && window.$helper.afterLogout) {
                window.$helper.afterLogout()
              }
              route.push({ name: 'login' }).catch(() => {})
              return Promise.reject(err)
            })
            .finally(() => {
              isRefreshing = false
            })
        } else {
          if (typeof window !== 'undefined' && window.$helper && window.$helper.afterLogout) {
            window.$helper.afterLogout()
          }
          route.push({ name: 'login' }).catch(() => {})
        }
      }

      if (error.response.data && error.response.data.message) {
        console.error(error.response.data.message)
        return Promise.reject(new Error(error.response.data.message))
      }
    }
    return Promise.reject(error)
  }
)

export default client
