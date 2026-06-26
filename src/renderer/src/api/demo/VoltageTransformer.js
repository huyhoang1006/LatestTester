/* eslint-disable */
import client from '@/utils/client'
const prefix = 'voltage-transformer'
export const getVoltageTransformerById = (id) => {
    return client.get(`/api/${prefix}/${id}`)
}