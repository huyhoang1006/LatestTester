'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getPersonRoleByMrid = () => {
  ipcMain.handle('getPersonRoleByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.personRoleFunc.getPersonRoleById(mrid)
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

export const getPersonRoleByPersonId = () => {
  ipcMain.handle('getPersonRoleByPersonId', async function (_event, personId) {
    try {
      const rs: any = await cimFunc.personRoleFunc.getPersonRoleByPersonId(personId)
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

export const insertPersonRole = () => {
  ipcMain.handle('insertPersonRole', async function (_event, data) {
    const rs: any = await cimFunc.personRoleFunc.insertPersonRole(data)
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

export const deletePersonRoleByMrid = () => {
  ipcMain.handle('deletePersonRoleByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.personRoleFunc.deletePersonRoleById(mrid)
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

export const updatePersonRoleByMrid = () => {
  ipcMain.handle('updatePersonRoleByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.personRoleFunc.updatePersonRole(mrid, data)
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
  getPersonRoleByMrid()
  getPersonRoleByPersonId()
  insertPersonRole()
  updatePersonRoleByMrid()
  deletePersonRoleByMrid()
}
