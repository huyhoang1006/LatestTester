import { ipcRenderer } from 'electron'

export const streetDetailPreload = () => ({
  getStreetDetailByMrid: (mrid: string) => ipcRenderer.invoke('getStreetDetailByMrid', mrid),
  getStreetDetailByLocationId: (locationId: string) =>
    ipcRenderer.invoke('getStreetDetailByLocationId', locationId)
})
