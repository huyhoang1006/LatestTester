import axios from 'axios'
import store from '@/store'
import route from '@/router'
import qs from 'qs'

const client = axios.create({
    withCredentials: false
})

let interceptorAuthenticate = null

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
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
    const refreshUrl = domain ? `${domain.replace(/\/$/, '')}/oauth/token` : '/oauth/token'
    const basicAuth = 'Basic ' + btoa('tester-client:tester-client')

    return axios.post(refreshUrl, qs.stringify({
        refresh_token: refreshTokenValue,
        grant_type: 'refresh_token'
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': basicAuth
        }
    }).then(response => {
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
                    route.push({name: 'login'}).catch(()=>{})
                    return Promise.reject(error)
                }

                if (!originalRequest._retry) {
                    originalRequest._retry = true

                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject })
                        })
                        .then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`
                            return client(originalRequest)
                        })
                        .catch(err => {
                            return Promise.reject(err)
                        })
                    }

                    isRefreshing = true

                    return refreshToken()
                        .then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`

                            processQueue(null, token)

                            return client(originalRequest)
                        })
                        .catch(err => {
                            processQueue(err, null)
                            if (typeof window !== 'undefined' && window.$helper && window.$helper.afterLogout) {
                                window.$helper.afterLogout()
                            }
                            route.push({name: 'login'}).catch(()=>{})
                            return Promise.reject(err)
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                } else {
                    if (typeof window !== 'undefined' && window.$helper && window.$helper.afterLogout) {
                        window.$helper.afterLogout()
                    }
                    route.push({name: 'login'}).catch(()=>{})
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