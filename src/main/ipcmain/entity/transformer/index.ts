'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertTransformerEntity = () => {
  ipcMain.handle('insertTransformerEntity', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.transformerEntityFunc.insertTransformerEntity(old_data, data)
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

export const getTransformerEntityByMrid = () => {
  ipcMain.handle('getTransformerEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.transformerEntityFunc.getTransformerEntityById(mrid, psrId)
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

export const deleteTransformerEntity = () => {
  ipcMain.handle('deleteTransformerEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.transformerEntityFunc.deleteTransformerEntity(data)
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
      console.error('Error retrieving Transformer entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const active = () => {
  insertTransformerEntity()
  getTransformerEntityByMrid()
  deleteTransformerEntity()
}
