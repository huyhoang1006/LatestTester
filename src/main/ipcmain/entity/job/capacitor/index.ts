'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertCapacitorJob = () => {
  ipcMain.handle('insertCapacitorJob', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.capacitorJob.insertCapacitorJobEntity(
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

export const getCapacitorJobByMrid = () => {
  ipcMain.handle('getCapacitorJobByMrid', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.capacitorJob.getCapacitorJobEntity(mrid)
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

export const deleteCapacitorJobByMrid = () => {
  ipcMain.handle('deleteCapacitorJobByMrid', async function (_event, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.capacitorJob.deleteCapacitorJobEntity(data)
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
  insertCapacitorJob()
  getCapacitorJobByMrid()
  deleteCapacitorJobByMrid()
}
