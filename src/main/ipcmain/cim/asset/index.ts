'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getAssetByMrid = () => {
  ipcMain.handle('getAssetByMrid', async function (_event, id) {
    try {
      const rs: any = await cimFunc.assetFunc.getAssetById(id)
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

export const getAssetByPsrIdAndKind = () => {
  ipcMain.handle('getAssetByPsrIdAndKind', async function (_event, psrId, kind) {
    try {
      const rs: any = await cimFunc.assetFunc.getAssetByPsrIdAndKind(psrId, kind)
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

export const updateAssetByMrid = () => {
  ipcMain.handle('updateAssetByMrid', async function (_event, mrid, data) {
    try {
      // Giả sử cimFunc.assetFunc có hàm updateAsset
      const rs: any = await cimFunc.assetFunc.updateAsset(mrid, data)
      return rs
    } catch (error: any) {
      console.log(error)
      return { success: false, message: error.message }
    }
  })
}

export const active = () => {
  getAssetByMrid()
  getAssetByPsrIdAndKind()
  updateAssetByMrid()
}
