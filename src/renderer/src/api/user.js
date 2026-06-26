/* eslint-disable */
import axios from 'axios'
import client from "@/utils/client"
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

    const loginUrl = domain ? `${domain}/oauth/token` : '/oauth/token'

    const basicAuth = 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)

    const formData = {
        username: data.username,
        password: data.password,
        grant_type: 'password'
    }

    return axios.post(loginUrl, qs.stringify(formData), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': basicAuth
        }
    }).then(response => {
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
