'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertCapacitorEntity = () => {
  ipcMain.handle('insertCapacitorEntity', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.capacitorEntityFunc.insertCapacitorEntity(old_data, data)
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

export const getCapacitorEntityByMrid = () => {
  ipcMain.handle('getCapacitorEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.capacitorEntityFunc.getCapacitorEntity(mrid, psrId)
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
      console.error('Error retrieving Power Cable entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteCapacitorEntity = () => {
  ipcMain.handle('deleteCapacitorEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.capacitorEntityFunc.deleteCapacitorEntity(data)
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
  insertCapacitorEntity()
  getCapacitorEntityByMrid()
  deleteCapacitorEntity()
}
