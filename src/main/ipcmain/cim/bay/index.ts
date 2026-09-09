'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getBayByMrid = () => {
  ipcMain.handle('getBayByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.bayFunc.getBayById(mrid)
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

export const getBayByVoltageBySubstationId = () => {
  ipcMain.handle(
    'getBayByVoltageBySubstationId',
    async function (_event, voltage_level, substationId) {
      try {
        const rs: any = await cimFunc.bayFunc.getBayByVoltageLevelOrSubstation(
          voltage_level,
          substationId
        )
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
    }
  )
}

export const insertBay = () => {
  ipcMain.handle('insertBay', async function (_event, data) {
    const rs: any = await cimFunc.bayFunc.insertBay(data)
    try {
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

export const updateBayByMrid = () => {
  ipcMain.handle('updateBayByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.bayFunc.updateBayById(mrid, data)
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

export const deleteBayByMrid = () => {
  ipcMain.handle('deleteBayByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.bayFunc.deleteBayById(mrid)
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
  getBayByMrid()
  getBayByVoltageBySubstationId()
  insertBay()
  updateBayByMrid()
  deleteBayByMrid()
}
