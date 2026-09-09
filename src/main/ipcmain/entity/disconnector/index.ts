'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

/**
 * Insert DisconnectorEntity
 */
export const insertDisconnectorEntity = () => {
  ipcMain.handle('insertDisconnectorEntity', async (_event, data) => {
    try {
      const rs: any = await entityFunc.disconnectorEntityFunc.insertDisconnectorEntity(data)
      return {
        success: rs.success === true,
        message: rs.success
          ? 'Insert DisconnectorEntity success'
          : 'Insert DisconnectorEntity failed',
        data: rs.data || null
      }
    } catch (error: any) {
      return {
        success: false,
        message: (error && error.message) || 'Internal error',
        error
      }
    }
  })
}

/**
 * Get DisconnectorEntity by MRID
 */
export const getDisconnectorEntityByMrid = () => {
  ipcMain.handle('getDisconnectorEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.disconnectorEntityFunc.getDisconnectorEntityById(mrid, psrId)
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
      console.error('Error retrieving Disconnector entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteDisconnectorEntity = () => {
  ipcMain.handle('deleteDisconnectorEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.disconnectorEntityFunc.deleteDisconnectorEntity(data)
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

/**
 * Active handlers
 */
export const active = () => {
  insertDisconnectorEntity()
  getDisconnectorEntityByMrid()
  deleteDisconnectorEntity()
}
