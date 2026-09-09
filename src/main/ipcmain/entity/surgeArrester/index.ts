'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertSurgeArresterEntity = () => {
  ipcMain.handle('insertSurgeArresterEntity', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.surgeArresterEntityFunc.insertSurgeArresterEntity(
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

export const getSurgeArresterEntityByMrid = () => {
  ipcMain.handle('getSurgeArresterEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.surgeArresterEntityFunc.getSurgeArresterEntityById(
        mrid,
        psrId
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
      console.error('Error retrieving Surge Arrester entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteSurgeArresterEntity = () => {
  ipcMain.handle('deleteSurgeArresterEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.surgeArresterEntityFunc.deleteSurgeArresterEntity(data)
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
  insertSurgeArresterEntity()
  getSurgeArresterEntityByMrid()
  deleteSurgeArresterEntity()
}
