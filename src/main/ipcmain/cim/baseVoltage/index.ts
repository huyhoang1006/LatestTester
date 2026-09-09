'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getBaseVoltageByMrid = () => {
  ipcMain.handle('getBaseVoltageByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.baseVoltageFunc.getBaseVoltageById(mrid)
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

export const insertBaseVoltage = () => {
  ipcMain.handle('insertBaseVoltage', async function (_event, data) {
    const rs: any = await cimFunc.baseVoltageFunc.insertBaseVoltage(data)
    try {
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

export const updateBaseVoltageByMrid = () => {
  ipcMain.handle('updateBaseVoltageByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.baseVoltageFunc.updateBaseVoltageById(mrid, data)
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

export const deleteBaseVoltageByMrid = () => {
  ipcMain.handle('deleteBaseVoltageByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.baseVoltageFunc.deleteBaseVoltageById(mrid)
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
  getBaseVoltageByMrid()
  insertBaseVoltage()
  updateBaseVoltageByMrid()
  deleteBaseVoltageByMrid()
}
