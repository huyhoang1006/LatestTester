'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertReactorEntity = () => {
  ipcMain.handle('insertReactorEntity', async function (_event, old_data, data) {
    try {
      const rs: any = await entityFunc.reactorEntityFunc.insertReactorEntity(old_data, data)
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

export const getReactorEntityByMrid = () => {
  ipcMain.handle('getReactorEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.reactorEntityFunc.getReactorEntity(mrid, psrId)
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
      console.error('Error retrieving Reactor entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteReactorEntity = () => {
  ipcMain.handle('deleteReactorEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.reactorEntityFunc.deleteReactorEntity(data)
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
  insertReactorEntity()
  getReactorEntityByMrid()
  deleteReactorEntity()
}
