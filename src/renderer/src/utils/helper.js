/* eslint-disable */
import store from '@/store'
import client from './client'

let interceptorAuthenticate = null

export const initApp = () => {
  const state = store.state

  const serviceAddr = localStorage.getItem('SERVICE_ADDR')
  if (serviceAddr) {
    try {
      new URL(serviceAddr)
      store.commit('SET_SERVICE_ADDR', serviceAddr)
      client.defaults.baseURL = serviceAddr
    } catch (e) {
      console.error('[Helper] Invalid SERVICE_ADDR:', serviceAddr)
      localStorage.removeItem('SERVICE_ADDR')
    }
  }

  const loginAddr = localStorage.getItem('LOGIN_ADDR')
  if (loginAddr) {
    store.commit('SET_LOGIN_ADDR', loginAddr)
  }

  const userStr = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (userStr && token) {
    const userData = JSON.parse(userStr)
    store.commit('SET_USER', userData)
    store.commit('SET_TOKEN', token)
    store.commit('SET_ROLE', role)
    store.commit('SET_IS_AUTHENTICATED', true)
    setupInterceptor(token)
  } else {
    store.commit('SET_IS_AUTHENTICATED', false)
  }
}

export const afterLogin = (remember, response) => {
  const accessToken = response.access_token
  const refreshToken = response.refresh_token
  const userInfo = response.actionUser

  let roleCode = ''
  if (userInfo && userInfo.usersGroups && userInfo.usersGroups.length > 0) {
    roleCode = userInfo.usersGroups[0].coded
  }

  localStorage.setItem('token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  localStorage.setItem(
    'user',
    JSON.stringify({
      user_id: userInfo.id,
      name: userInfo.username,
      email: userInfo.email,
      role: roleCode,
      token_type: response.token_type,
      refresh_token: refreshToken,
      access_token: accessToken,
      exp: response.expires_in
    })
  )
  localStorage.setItem('role', roleCode)

  store.commit('SET_USER', {
    user_id: userInfo.id,
    name: userInfo.username,
    email: userInfo.email,
    role: roleCode,
    token_type: response.token_type,
    refresh_token: refreshToken,
    access_token: accessToken,
    exp: response.expires_in
  })
  store.commit('SET_TOKEN', accessToken)
  store.commit('SET_ROLE', roleCode)
  store.commit('SET_IS_AUTHENTICATED', true)

  setupInterceptor(accessToken)
}

export const afterLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('role')

  store.commit('CLEAR_USER')

  if (interceptorAuthenticate !== null) {
    client.interceptors.request.eject(interceptorAuthenticate)
    interceptorAuthenticate = null
  }
}

export const setServerAddr = ({ loginDomain, serviceDomain }) => {
  localStorage.setItem('LOGIN_ADDR', loginDomain)
  localStorage.setItem('SERVICE_ADDR', serviceDomain)
  store.commit('SET_LOGIN_ADDR', loginDomain)
  store.commit('SET_SERVICE_ADDR', serviceDomain)
  client.defaults.baseURL = serviceDomain
}

function setupInterceptor(token) {
  if (interceptorAuthenticate !== null) {
    client.interceptors.request.eject(interceptorAuthenticate)
  }

  interceptorAuthenticate = client.interceptors.request.use(
    function (config) {
      config.headers.Authorization = `Bearer ${token}`
      return config
    },
    function (err) {
      return Promise.reject(err)
    }
  )
}
