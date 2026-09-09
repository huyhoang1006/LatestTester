'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertBayEntity = () => {
  ipcMain.handle('insertBayEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.bayEntityFunc.insertBayEntity(data)
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

export const getBayEntityByMrid = () => {
  ipcMain.handle('getBayEntityByMrid', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.bayEntityFunc.getBayEntity(mrid)
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

export const deleteBayEntityByMrid = () => {
  ipcMain.handle('deleteBayEntityByMrid', async function (_event, data) {
    try {
      const rs: any = await entityFunc.bayEntityFunc.deleteBayEntityById(data)
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
  insertBayEntity()
  getBayEntityByMrid()
  deleteBayEntityByMrid()
}
