'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertCircuitBreakerJob = () => {
  ipcMain.handle('insertCircuitBreakerJob', async function (_event, old_data, data) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.circuitBreakerJob.insertCircuitBreakerJobEntity(
          old_data,
          data
        )
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

export const getCircuitBreakerJobByMrid = () => {
  ipcMain.handle('getCircuitBreakerJobByMrid', async function (_event, mrid) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.circuitBreakerJob.getCircuitBreakerJobEntity(mrid)
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

export const deleteCircuitBreakerJobByMrid = () => {
  ipcMain.handle('deleteCircuitBreakerJobByMrid', async function (_event, data) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.circuitBreakerJob.deleteCircuitBreakerJobEntity(data)
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
  insertCircuitBreakerJob()
  getCircuitBreakerJobByMrid()
  deleteCircuitBreakerJobByMrid()
}
