'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertSurgeArresterJob = () => {
  ipcMain.handle('insertSurgeArresterJob', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.jobEntityFunc.surgeArresterJob.insertSurgeArresterJobEntity(
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

export const getSurgeArresterJobByMrid = () => {
  ipcMain.handle('getSurgeArresterJobByMrid', async function (_event, mrid) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.surgeArresterJob.getSurgeArresterJobEntity(mrid)
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

export const deleteSurgeArresterJobByMrid = () => {
  ipcMain.handle('deleteSurgeArresterJobByMrid', async function (_event, data) {
    try {
      const rs: any =
        await entityFunc.jobEntityFunc.surgeArresterJob.deleteSurgeArresterJobEntity(data)
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
  insertSurgeArresterJob()
  getSurgeArresterJobByMrid()
  deleteSurgeArresterJobByMrid()
}
