'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getTelephoneNumberByMrid = () => {
  ipcMain.handle('getTelephoneNumberByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.telephoneNumberFunc.getTelephoneNumberById(mrid)
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

export const insertTelephoneNumber = () => {
  ipcMain.handle('insertTelephoneNumber', async function (_event, data) {
    const rs: any = await cimFunc.telephoneNumberFunc.insertTelephoneNumber(data)
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

export const deleteTelephoneNumberByMrid = () => {
  ipcMain.handle('deleteTelephoneNumberByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.telephoneNumberFunc.deleteTelephoneNumberById(mrid)
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

export const updateTelephoneNumberByMrid = () => {
  ipcMain.handle('updateTelephoneNumberByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.telephoneNumberFunc.updateTelephoneNumberById(mrid, data)
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
  getTelephoneNumberByMrid()
  insertTelephoneNumber()
  updateTelephoneNumberByMrid()
  deleteTelephoneNumberByMrid()
}
