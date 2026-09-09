import { ipcRenderer } from 'electron'

export const configurationEventPreload = () => ({
  getConfigurationEventByMrid: (mrid: string) =>
    ipcRenderer.invoke('getConfigurationEventByMrid', mrid),
  getAllConfigurationEvents: () => ipcRenderer.invoke('getAllConfigurationEvents'),
  insertConfigurationEvent: (data: unknown) => ipcRenderer.invoke('insertConfigurationEvent', data),
  updateConfigurationEventByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateConfigurationEventByMrid', mrid, data),
  deleteConfigurationEventByMrid: (mrid: string) =>
    ipcRenderer.invoke('deleteConfigurationEventByMrid', mrid)
})
