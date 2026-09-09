'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getProductAssetModelByMrid = () => {
  ipcMain.handle('getProductAssetModelByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.ProductAssetModelFunc.getProductAssetModelById(mrid)
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

export const insertProductAssetModel = () => {
  ipcMain.handle('insertProductAssetModel', async function (_event, data) {
    const rs: any = await cimFunc.ProductAssetModelFunc.insertProductAssetModel(data)
    try {
      if (rs.success == true) {
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

export const deleteProductAssetModelByMrid = () => {
  ipcMain.handle('deleteProductAssetModelByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.ProductAssetModelFunc.deleteProductAssetModelById(mrid)
      if (rs.success == true) {
        return {
          success: true,
          message: rs.message || 'Success'
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

export const updateProductAssetModelByMrid = () => {
  ipcMain.handle('updateProductAssetModelByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.ProductAssetModelFunc.updateProductAssetModel(mrid, data)
      if (rs.success == true) {
        return {
          success: true,
          message: rs.message || 'Success'
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
  getProductAssetModelByMrid()
  insertProductAssetModel()
  updateProductAssetModelByMrid()
  deleteProductAssetModelByMrid()
}
