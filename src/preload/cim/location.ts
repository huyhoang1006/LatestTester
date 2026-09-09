import { ipcRenderer } from 'electron'

export const locationPreload = () => ({
  getLocationByMrid: (mrid: string) => ipcRenderer.invoke('getLocationByMrid', mrid),
  getLocationByOrganisationId: (organisationId: string) =>
    ipcRenderer.invoke('getLocationByOrganisationId', organisationId),
  getLocationDetailByMrid: (mrid: string) => ipcRenderer.invoke('getLocationDetailByMrid', mrid),
  insertLocation: (data: unknown) => ipcRenderer.invoke('insertLocation', data),
  updateLocationByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateLocationByMrid', mrid, data),
  deleteLocationByMrid: (mrid: string) => ipcRenderer.invoke('deleteLocationByMrid', mrid)
})
