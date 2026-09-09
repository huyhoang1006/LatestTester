'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getConfigurationEventByMrid = () => {
  ipcMain.handle('getConfigurationEventByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.configurationEventFunc.getConfigurationEventById(mrid)
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

export const getAllConfigurationEvents = () => {
  ipcMain.handle('getAllConfigurationEvents', async function (_event) {
    try {
      const rs: any = await cimFunc.configurationEventFunc.getAllConfigurationEvents()
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

export const insertConfigurationEvent = () => {
  ipcMain.handle('insertConfigurationEvent', async function (_event, data) {
    const rs: any = await cimFunc.configurationEventFunc.insertConfigurationEvent(data)
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

export const deleteConfigurationEventByMrid = () => {
  ipcMain.handle('deleteConfigurationEventByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.configurationEventFunc.deleteConfigurationEventById(mrid)
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

export const updateConfigurationEventByMrid = () => {
  ipcMain.handle('updateConfigurationEventByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.configurationEventFunc.updateConfigurationEventById(mrid, data)
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
  getConfigurationEventByMrid()
  getAllConfigurationEvents()
  insertConfigurationEvent()
  updateConfigurationEventByMrid()
  deleteConfigurationEventByMrid()
}
