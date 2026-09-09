'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getPowerSystemResourceByMrid = () => {
  ipcMain.handle('getPowerSystemResourceByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.PowerSystemResourceFunc.getPowerSystemResourceById(mrid)
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

export const insertPowerSystemResource = () => {
  ipcMain.handle('insertPowerSystemResource', async function (_event, data) {
    try {
      const rs: any = await cimFunc.PowerSystemResourceFunc.insertPowerSystemResource(data)
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

export const updatePowerSystemResourceByMrid = () => {
  ipcMain.handle('updatePowerSystemResourceByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.PowerSystemResourceFunc.updatePowerSystemResourceById(
        mrid,
        data
      )
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

export const deletePowerSystemResourceByMrid = () => {
  ipcMain.handle('deletePowerSystemResourceByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.PowerSystemResourceFunc.deletePowerSystemResourceById(mrid)
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

export const getLocationByPowerSystemResourceMrid = () => {
  ipcMain.handle('getLocationByPowerSystemResourceMrid', async function (_event, psrId) {
    try {
      const rs: any =
        await cimFunc.PowerSystemResourceFunc.getLocationByPowerSystemResourceId(psrId)
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

export const active = () => {
  getPowerSystemResourceByMrid()
  getLocationByPowerSystemResourceMrid()
  insertPowerSystemResource()
  updatePowerSystemResourceByMrid()
  deletePowerSystemResourceByMrid()
}
