'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getLocationByMrid = () => {
  ipcMain.handle('getLocationByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.locationFunc.getLocationById(mrid)
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

export const getLocationByOrganisationId = () => {
  ipcMain.handle('getLocationByOrganisationId', async function (_event, organisationId) {
    try {
      const rs: any = await cimFunc.locationFunc.getLocationByOrganisationId(organisationId)
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

export const insertLocation = () => {
  ipcMain.handle('insertLocation', async function (_event, data) {
    const rs: any = await cimFunc.locationFunc.insertLocation(data)
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

export const deleteLocationByMrid = () => {
  ipcMain.handle('deleteLocationByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.locationFunc.deleteLocationById(mrid)
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

export const updateLocationByMrid = () => {
  ipcMain.handle('updateLocationByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.locationFunc.updateLocation(mrid, data)
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

export const getLocationDetailByMrid = () => {
  ipcMain.handle('getLocationDetailByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.locationFunc.getLocationDetailByMrid(mrid)
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
  getLocationByMrid()
  getLocationByOrganisationId()
  getLocationDetailByMrid()
  insertLocation()
  updateLocationByMrid()
  deleteLocationByMrid()
}
