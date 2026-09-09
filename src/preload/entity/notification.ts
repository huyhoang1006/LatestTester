import { ipcRenderer } from 'electron'

export const notificationEntityPreload = () => ({
  getAllNotifications: () => ipcRenderer.invoke('getAllNotifications'),
  getNotificationById: (mrid: string) => ipcRenderer.invoke('getNotificationById', mrid),
  insertNotification: (data: unknown) => ipcRenderer.invoke('insertNotification', data),
  updateNotification: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateNotification', mrid, data),
  markNotificationAsRead: (mrid: string) => ipcRenderer.invoke('markNotificationAsRead', mrid),
  hmrideNotification: (mrid: string) => ipcRenderer.invoke('hmrideNotification', mrid),
  deleteNotification: (mrid: string) => ipcRenderer.invoke('deleteNotification', mrid),
  deleteAllNotifications: () => ipcRenderer.invoke('deleteAllNotifications')
})
