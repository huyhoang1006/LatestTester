'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getPositionPointMrid = () => {
  ipcMain.handle('getPositionPointMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.positionPointFunc.getPositionPointById(mrid)
      if (rs.success === true) {
        return {
          success: true,
          message: rs.message || 'Success',
          data: rs.data
        }
      } else {
        return {
          success: false,
          message: rs.message || 'fail'
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

export const getPositionPointByLocationId = () => {
  ipcMain.handle('getPositionPointByLocationId', async function (_event, locationId) {
    try {
      const rs: any = await cimFunc.positionPointFunc.getPositionPointByLocationId(locationId)
      if (rs.success === true) {
        return {
          success: true,
          message: rs.message || 'Success',
          data: rs.data
        }
      } else {
        return {
          success: false,
          message: rs.message || 'fail'
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

export const active = () => {
  getPositionPointMrid()
  getPositionPointByLocationId()
}
