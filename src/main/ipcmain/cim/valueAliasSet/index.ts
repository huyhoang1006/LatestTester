import { ipcMain } from 'electron'
import { cimFunc } from '@/function'

export const getValueAliasSetByMrid = () => {
  ipcMain.handle('getValueAliasSetByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.valueAliasSetFunc.getValueAliasSetById(mrid)
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

export const getValueAliasSetAndValueToAliasByMrid = () => {
  ipcMain.handle('getValueAliasSetAndValueToAliasByMrid', async function (_event, mrid) {
    try {
      const rs: any = await cimFunc.valueAliasSetFunc.getValueAliasSetAndValueToAliasById(mrid)
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

export const getValueAliasSetByMrids = () => {
  ipcMain.handle('getValueAliasSetByMrids', async function (_event, mridArray) {
    try {
      const rs: any = await cimFunc.valueAliasSetFunc.getValueAliasSetByIds(mridArray)
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

export const active = () => {
  getValueAliasSetByMrid()
  getValueAliasSetAndValueToAliasByMrid()
  getValueAliasSetByMrids()
}
