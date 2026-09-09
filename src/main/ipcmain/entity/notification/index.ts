'use strict'
import { ipcMain } from 'electron'
import { entityFunc } from '@/function'

export const getAllNotifications = () => {
  ipcMain.handle('getAllNotifications', async function (_event) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.getAllNotifications()
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

export const getNotificationById = () => {
  ipcMain.handle('getNotificationById', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.getNotificationById(mrid)
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

export const insertNotification = () => {
  ipcMain.handle('insertNotification', async function (_event, data) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.insertNotification(data)
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

export const updateNotification = () => {
  ipcMain.handle('updateNotification', async function (_event, mrid, data) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.updateNotification(mrid, data)
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

export const markAsRead = () => {
  ipcMain.handle('markNotificationAsRead', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.markAsRead(mrid)
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
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const hmrideNotification = () => {
  ipcMain.handle('hmrideNotification', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.hmrideNotification(mrid)
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
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteNotification = () => {
  ipcMain.handle('deleteNotification', async function (_event, mrid) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.deleteNotification(mrid)
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
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const deleteAllNotifications = () => {
  ipcMain.handle('deleteAllNotifications', async function (_event) {
    try {
      const rs: any = await entityFunc.notificationEntityFunc.deleteAllNotifications()
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
      return {
        error: error,
        success: false,
        message: error && error.message ? error.message : 'Internal error'
      }
    }
  })
}

export const active = () => {
  getAllNotifications()
  getNotificationById()
  insertNotification()
  updateNotification()
  markAsRead()
  hmrideNotification()
  deleteNotification()
  deleteAllNotifications()
}
