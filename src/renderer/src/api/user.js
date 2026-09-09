/* eslint-disable */
import axios from 'axios'
import client from '@/utils/client'
import qs from 'qs'

const CLIENT_ID = 'tester-client'
const CLIENT_SECRET = 'tester-client'

const API_PREFIX = 'api/v1'
const RESOURCE = 'users'

export const login = (data) => {
  let domain = localStorage.getItem('LOGIN_ADDR') || ''

  if (domain.endsWith('/')) {
    domain = domain.slice(0, -1)
  }

  // Luôn dùng absolute LOGIN_ADDR khi có Electron IPC (Node axios không bị CORS).
  // Chỉ dùng relative /oauth/token qua Vite proxy khi chạy web thuần không có electronAPI.
  const hasAuthIPC = typeof window !== 'undefined' && window.electronAPI && window.electronAPI.authRequest
  const isViteProxy =
    !hasAuthIPC &&
    typeof window !== 'undefined' &&
    window.location &&
    window.location.port === '8080' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const loginUrl = isViteProxy ? '/oauth/token' : domain ? `${domain}/oauth/token` : '/oauth/token'

  const basicAuth = 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)

  const formData = {
    username: data.username,
    password: data.password,
    grant_type: 'password'
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: basicAuth
  }

  // Chạy request qua main process (Node http, không bị CORS/preflight của renderer chi phối)
  // thay vì gọi thẳng axios trong renderer, vì webSecurity: true bật CORS như trình duyệt thật.
  if (window.electronAPI && window.electronAPI.authRequest) {
    return window.electronAPI
      .authRequest({
        url: loginUrl,
        data: qs.stringify(formData),
        headers
      })
      .then((result) => {
        if (result.success) {
          return result.data
        }
        return Promise.reject({
          response: { status: result.status, data: result.data },
          message: result.message
        })
      })
  }

  return axios.post(loginUrl, qs.stringify(formData), { headers }).then((response) => {
    return response.data
  })
}

export const signup = (data) => {
  return client.post('signup', data)
}

export const changePass = (data) => {
  return client.put('account/password', data)
}

export const getAll = () => {
  return client.get(`${API_PREFIX}/${RESOURCE}`)
}
