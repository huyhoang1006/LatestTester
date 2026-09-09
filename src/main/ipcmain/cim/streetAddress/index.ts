'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getStreetAddressByMrid = () => {
  ipcMain.handle('getStreetAddressByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.streetAddressFunc.getStreetAddressById(mrid)
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

export const insertStreetAddress = () => {
  ipcMain.handle('insertStreetAddress', async function (_event, data) {
    const rs: any = await cimFunc.streetAddressFunc.insertStreetAddress(data)
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

export const deleteStreetAddressByMrid = () => {
  ipcMain.handle('deleteStreetAddressByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.streetAddressFunc.deleteStreetAddressById(mrid)
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

export const updateStreetAddressByMrid = () => {
  ipcMain.handle('updateStreetAddressByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.streetAddressFunc.updateStreetAddressById(mrid, data)
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
  getStreetAddressByMrid()
  insertStreetAddress()
  updateStreetAddressByMrid()
  deleteStreetAddressByMrid()
}
