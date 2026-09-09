'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const updateOnlineMonitoringData = () => {
  ipcMain.handle('updateOnlineMonitoringData', async function (_event, online_monitoring) {
    try {
      const rs: any =
        await entityFunc.onlineMonitoringFunc.updateOnlineMonitoringData(online_monitoring)
      return { success: rs.success !== false, message: rs.message || 'Success' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Internal error' }
    }
  })
}

export const insertOnlineMonitoringData = () => {
  ipcMain.handle('insertOnlineMonitoringData', async function (_event, assetId, online_monitoring) {
    try {
      const rs: any = await entityFunc.onlineMonitoringFunc.insertOnlineMonitoringData(
        assetId,
        online_monitoring
      )
      return { success: rs.success !== false, message: rs.message || 'Success' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Internal error' }
    }
  })
}

export const deleteMonitorsByAssetId = () => {
  ipcMain.handle('deleteMonitorsByAssetId', async function (_event, assetId) {
    try {
      const rs: any = await entityFunc.onlineMonitoringFunc.deleteMonitorsByAssetId(assetId)
      return { success: rs.success !== false, message: rs.message || 'Success' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Internal error' }
    }
  })
}

export const getOnlineMonitoringData = () => {
  ipcMain.handle('getOnlineMonitoringData', async function (_event, assetId) {
    try {
      const rs = await entityFunc.onlineMonitoringFunc.getOnlineMonitoringData(assetId)
      return rs
    } catch (error: any) {
      return { success: false, message: error.message || 'Internal error', data: null }
    }
  })
}

export const active = () => {
  updateOnlineMonitoringData()
  insertOnlineMonitoringData()
  deleteMonitorsByAssetId()
  getOnlineMonitoringData()
}
