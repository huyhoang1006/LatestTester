import { ipcRenderer } from 'electron'

export const streetAddressPreload = () => ({
  getStreetAddressByMrid: (mrid: string) => ipcRenderer.invoke('getStreetAddressByMrid', mrid),
  insertStreetAddress: (data: unknown) => ipcRenderer.invoke('insertStreetAddress', data),
  updateStreetAddressByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateStreetAddressByMrid', mrid, data),
  deleteStreetAddressByMrid: (mrid: string) => ipcRenderer.invoke('deleteStreetAddressByMrid', mrid)
})
