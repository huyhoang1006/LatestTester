'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertCurrentTransformerEntity = () => {
  ipcMain.handle('insertCurrentTransformerEntity', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.currentTransformerEntityFunc.insertCurrentTransformerEntity(
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
      console.log(error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const getCurrentTransformerEntityByMrid = () => {
  ipcMain.handle('getCurrentTransformerEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.currentTransformerEntityFunc.getCurrentTransformerEntityById(
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
      console.error('Error retrieving Current transformer entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteCurrentTransformerEntity = () => {
  ipcMain.handle('deleteCurrentTransformerEntity', async function (_event, data) {
    try {
      const rs: any =
        await entityFunc.currentTransformerEntityFunc.deleteCurrentTransformerEntity(data)
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
  insertCurrentTransformerEntity()
  getCurrentTransformerEntityByMrid()
  deleteCurrentTransformerEntity()
}
