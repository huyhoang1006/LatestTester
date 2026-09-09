'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertSubstationEntity = () => {
  ipcMain.handle('insertSubstationEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.substationEntityFunc.insertSubstationEntity(data)
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
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const getSubstationEntityByMrid = () => {
  ipcMain.handle(
    'getSubstationEntityByMrid',
    async function (_event, mrid, user_id, organisation_id) {
      try {
        const rs: any = await entityFunc.substationEntityFunc.getSubstationEntityById(
          mrid,
          user_id,
          organisation_id
        )
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
        return {
          error: error,
          success: false,
          message: error && error.message ? error.message : 'Internal error'
        }
      }
    }
  )
}

export const deleteSubstationEntityByMrid = () => {
  ipcMain.handle('deleteSubstationEntityByMrid', async function (_event, data) {
    try {
      const rs: any = await entityFunc.substationEntityFunc.deleteSubstationEntityById(data)
      if (rs.success == true) {
        return {
          success: true,
          message: 'Success',
          data: data
        }
      } else {
        return {
          success: false,
          message: 'fail'
        }
      }
    } catch (error: any) {
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const active = () => {
  insertSubstationEntity()
  getSubstationEntityByMrid()
  deleteSubstationEntityByMrid()
}
