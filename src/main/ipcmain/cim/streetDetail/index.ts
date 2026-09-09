'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getStreetDetailByMrid = () => {
  ipcMain.handle('getStreetDetailByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.streetDetailFunc.getStreetDetailById(mrid)
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

export const getStreetDetailByLocationId = () => {
  ipcMain.handle('getStreetDetailByLocationId', async function (_event, locationId) {
    try {
      const rs: any = await cimFunc.streetDetailFunc.getStreetDetailByLocationId(locationId)
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

export const insertStreetDetail = () => {
  ipcMain.handle('insertStreetDetail', async function (_event, data) {
    const rs: any = await cimFunc.streetDetailFunc.insertStreetDetail(data)
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

export const deleteStreetDetailByMrid = () => {
  ipcMain.handle('deleteStreetDetailByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.streetDetailFunc.deleteStreetDetailById(mrid)
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

export const updateStreetDetailByMrid = () => {
  ipcMain.handle('updateStreetDetailByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.streetDetailFunc.updateStreetDetailById(mrid, data)
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
  getStreetDetailByMrid()
  getStreetDetailByLocationId()
  insertStreetDetail()
  updateStreetDetailByMrid()
  deleteStreetDetailByMrid()
}
