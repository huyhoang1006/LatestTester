'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const insertRotatingMachineEntity = () => {
  ipcMain.handle('insertRotatingMachineEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.rotatingMachineEntityFunc.insertRotatingMachineEntity(data)
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

export const getRotatingMachineEntityByMrid = () => {
  ipcMain.handle('getRotatingMachineEntityByMrid', async function (_event, mrid, psrId) {
    try {
      const rs: any = await entityFunc.rotatingMachineEntityFunc.getRotatingMachineEntity(
        mrid,
        psrId
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
      console.error('Error retrieving Power Cable entity by MRID:', error)
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteRotatingMachineEntity = () => {
  ipcMain.handle('deleteRotatingMachineEntity', async function (_event, data) {
    try {
      const rs: any = await entityFunc.rotatingMachineEntityFunc.deleteRotatingMachineEntity(data)
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
  insertRotatingMachineEntity()
  getRotatingMachineEntityByMrid()
  deleteRotatingMachineEntity()
}
