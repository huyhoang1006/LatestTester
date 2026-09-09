'use strict'
import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getSurgeArresterByMrid = () => {
  ipcMain.handle('getSurgeArresterByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.surgeArresterFunc.getSurgeArresterById(mrid)
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

export const insertSurgeArrester = () => {
  ipcMain.handle('insertSurgeArrester', async function (_event, data) {
    try {
      const rs: any = await cimFunc.surgeArresterFunc.insertSurgeArrester(data)
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

export const updateSurgeArresterByMrid = () => {
  ipcMain.handle('updateSurgeArresterByMrid', async function (_event, mrid, data) {
    try {
      const rs: any = await cimFunc.surgeArresterFunc.updateSurgeArrester(mrid, data)
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

export const deleteSurgeArresterByMrid = () => {
  ipcMain.handle('deleteSurgeArresterByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.surgeArresterFunc.deleteSurgeArresterById(mrid)
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

export const getSurgeArresterByPsrId = () => {
  ipcMain.handle('getSurgeArresterByPsrId', async function (_event, psrId) {
    try {
      const rs: any = await cimFunc.surgeArresterFunc.getSurgeArresterByPsrId(psrId)
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

export const active = () => {
  getSurgeArresterByMrid()
  getSurgeArresterByPsrId()
  insertSurgeArrester()
  updateSurgeArresterByMrid()
  deleteSurgeArresterByMrid()
}
