'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertTransformerJob = () => {
  ipcMain.handle('insertTransformerJob', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.transformerJob.insertTransformerJobEntity(
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

export const getTransformerJobByMrid = () => {
  ipcMain.handle('getTransformerJobByMrid', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.transformerJob.getTransformerJobEntity(mrid)
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

export const deleteTransformerJobByMrid = () => {
  ipcMain.handle('deleteTransformerJobByMrid', async function (_event, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.transformerJob.deleteTransformerJobEntity(data)
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
  insertTransformerJob()
  getTransformerJobByMrid()
  deleteTransformerJobByMrid()
}
