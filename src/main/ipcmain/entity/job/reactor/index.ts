'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertReactorJob = () => {
  ipcMain.handle('insertReactorJob', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.reactorJob.insertReactorJobEntity(
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

export const getReactorJobByMrid = () => {
  ipcMain.handle('getReactorJobByMrid', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.reactorJob.getReactorJobEntity(mrid)
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

export const deleteReactorJobByMrid = () => {
  ipcMain.handle('deleteReactorJobByMrid', async function (_event, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.reactorJob.deleteReactorJobEntity(data)
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
  insertReactorJob()
  getReactorJobByMrid()
  deleteReactorJobByMrid()
}
