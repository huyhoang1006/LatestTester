import { ipcMain } from 'electron'
import {
  checkLicenseLimitation,
  initLicenseLimitation,
  updateLicenseLimit
} from '../../../function/cim/license/index'

export const active = () => {
  initLicenseLimitation()
  ipcMain.handle('updateLicenseLimit', async (_event, name, limit) => {
    return await updateLicenseLimit(name, limit)
  })
  ipcMain.handle('checkLicenseLimitation', async (_event, name) => {
    try {
      return await checkLicenseLimitation(name)
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  })
  ipcMain.handle('getAllLicenses', async () => {
    return []
  })
}
