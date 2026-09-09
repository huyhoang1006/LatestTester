'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertVoltageLevelEntity = () => {
  ipcMain.handle('insertVoltageLevelEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.voltageLevelEntityFunc.insertVoltageLevelEntity(data)
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

export const getVoltageLevelEntityByMrid = () => {
  ipcMain.handle('getVoltageLevelEntityByMrid', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.voltageLevelEntityFunc.getVoltageLevelEntity(mrid)
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

export const deleteVoltageLevelEntityByMrid = () => {
  ipcMain.handle('deleteVoltageLevelEntityByMrid', async function (_event, data) {
    try {
      const rs: any = await entityFunc.voltageLevelEntityFunc.deleteVoltageLevelById(data)
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
  insertVoltageLevelEntity()
  getVoltageLevelEntityByMrid()
  deleteVoltageLevelEntityByMrid()
}
