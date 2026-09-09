'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getParentOrganizationByMrid = () => {
  ipcMain.handle('getParentOrganizationByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.parentOrganizationFunc.getParentOrganizationById(mrid)
      if (rs.success === true) {
        rs.data.aliasName = rs.data.alias_name
        rs.data.mode = 'organisation'
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

export const getParentOrganizationByParentMrid = () => {
  ipcMain.handle('getParentOrganizationByParentMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.parentOrganizationFunc.getParentOrganizationByParentId(mrid)
      if (rs.success === true) {
        rs.data = rs.data.map((item) => ({
          ...item,
          aliasName: item.alias_name,
          mode: 'organisation'
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

export const insertParentOrganization = () => {
  ipcMain.handle('insertParentOrganization', async function (_event, data) {
    const rs: any = await cimFunc.parentOrganizationFunc.insertParentOrganisation(data)
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

export const updateParentOrganizationByMrid = () => {
  ipcMain.handle('updateParentOrganizationByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.parentOrganizationFunc.updateParentOrganizationById(mrid, data)
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

export const deleteParentOrganizationByMrid = () => {
  ipcMain.handle('deleteParentOrganizationByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.parentOrganizationFunc.deleteParentOrganizationById(mrid)
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
  getParentOrganizationByMrid()
  getParentOrganizationByParentMrid()
  insertParentOrganization()
  updateParentOrganizationByMrid()
  deleteParentOrganizationByMrid()
}
