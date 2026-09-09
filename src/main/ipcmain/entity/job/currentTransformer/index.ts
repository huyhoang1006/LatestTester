'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertCurrentTransformerJob = () => {
  ipcMain.handle('insertCurrentTransformerJob', async function (_event, old_data, data) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.currentTransformerJob.insertCurrentTransformerJobEntity(
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

export const getCurrentTransformerJobByMrid = () => {
  ipcMain.handle('getCurrentTransformerJobByMrid', async function (_event, mrid) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.currentTransformerJob.getCurrentTransformerJobEntity(mrid)
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

export const deleteCurrentTransformerJobByMrid = () => {
  ipcMain.handle('deleteCurrentTransformerJobByMrid', async function (_event, data) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.currentTransformerJob.deleteCurrentTransformerJobEntity(data)
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
  insertCurrentTransformerJob()
  getCurrentTransformerJobByMrid()
  deleteCurrentTransformerJobByMrid()
}
