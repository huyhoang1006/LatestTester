'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertBreakerEntity = () => {
  ipcMain.handle('insertBreakerEntity', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.breakerEntityFunc.insertBreakerEntity(old_data, data)
      if (rs.success == true) {
        return {
          success: true,
          message: 'Success',
          data: rs.data
        }
      } else {
        return {
          success: false,
          message: 'fail'
        }
      }
    } catch (error: any) {
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const getBreakerEntityByMrid = () => {
  ipcMain.handle('getBreakerEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.breakerEntityFunc.getBreakerEntity(mrid, psrId)
      if (rs.success == true) {
        return {
          success: true,
          message: 'Success',
          data: rs.data
        }
      } else {
        return {
          success: false,
          message: 'fail'
        }
      }
    } catch (error: any) {
      console.error('Error retrieving circuit breaker entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteBreakerEntity = () => {
  ipcMain.handle('deleteBreakerEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.breakerEntityFunc.deleteBreakerEntity(data)
      if (rs.success == true) {
        return {
          success: true,
          message: 'Success',
          data: data
        }
      } else {
        return {
          success: false,
          message: 'fail'
        }
      }
    } catch (error: any) {
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const active = () => {
  insertBreakerEntity()
  getBreakerEntityByMrid()
  deleteBreakerEntity()
}
