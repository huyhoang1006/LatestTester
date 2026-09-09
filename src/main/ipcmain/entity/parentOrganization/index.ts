'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertParentOrganizationEntity = () => {
  ipcMain.handle('insertParentOrganizationEntity', async function (_event, data) {
    const rs: any = await entityFunc.parentOrganizationEntityFunc.insertOrganisationEntity(data)
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

export const getOrganisationEntityByMrid = () => {
  ipcMain.handle('getOrganisationEntityByMrid', async function (_event, id) {
    const rs: any = await entityFunc.parentOrganizationEntityFunc.getOrganisationEntityById(id)
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

export const deleteParentOrganizationEntity = () => {
  ipcMain.handle('deleteParentOrganizationEntity', async function (_event, data) {
    const rs: any = await entityFunc.parentOrganizationEntityFunc.deleteOrganisationEntityById(data)
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

export const active = () => {
  insertParentOrganizationEntity()
  getOrganisationEntityByMrid()
  deleteParentOrganizationEntity()
}
