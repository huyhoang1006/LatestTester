'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getSubstationByMrid = () => {
  ipcMain.handle('getSubstationByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.substationFunc.getSubstationById(mrid)
      if (rs.success === true) {
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
      console.log(error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const getSubstationsInOrganisationForUser = () => {
  ipcMain.handle('getSubstationsInOrganisationForUser', async function (_event, mrid, userId) {
    try {
      const rs: any = await cimFunc.substationFunc.getSubstationsInOrganisationForUser(mrid, userId)
      if (rs.success === true) {
        rs.data = rs.data.map((item) => ({
          ...item,
          mode: 'substation'
        }))
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
      console.log(error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const insertSubstation = () => {
  ipcMain.handle('insertSubstation', async function (_event, data) {
    const rs: any = await cimFunc.substationFunc.insertSubstation(data)
    try {
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
      console.log(error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const updateSubstationByMrid = () => {
  ipcMain.handle('updateSubstationByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.substationFunc.updateSubstationById(mrid, data)
      if (rs.success == true) {
        return {
          success: true,
          message: 'Success'
        }
      } else {
        return {
          success: false,
          message: 'fail'
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

export const deleteSubstationByMrid = () => {
  ipcMain.handle('deleteSubstationByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.substationFunc.deleteSubstationById(mrid)
      if (rs.success == true) {
        return {
          success: true,
          message: 'Success'
        }
      } else {
        return {
          success: false,
          message: 'fail'
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
  getSubstationByMrid()
  getSubstationsInOrganisationForUser()
  insertSubstation()
  updateSubstationByMrid()
  deleteSubstationByMrid()
}
