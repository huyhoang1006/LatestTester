'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertBushingEntity = () => {
  ipcMain.handle('insertBushingEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.bushingEntityFunc.insertBushingEntity(data)
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

export const getBushingEntityByMrid = () => {
  ipcMain.handle('getBushingEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.bushingEntityFunc.getBushingEntityById(mrid, psrId)
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
      console.error('Error retrieving Bushing entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteBushingEntity = () => {
  ipcMain.handle('deleteBushingEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.bushingEntityFunc.deleteBushingEntity(data)
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
  insertBushingEntity()
  getBushingEntityByMrid()
  deleteBushingEntity()
}
