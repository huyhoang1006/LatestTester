import { ipcRenderer } from 'electron'

export const powerCablePreload = () => ({
  getPowerCableByMrid: (mrid: string) => ipcRenderer.invoke('getPowerCableByMrid', mrid),
  getPowerCableByPsrId: (mrid: string) => ipcRenderer.invoke('getPowerCableByPsrId', mrid),
  insertPowerCable: (data: unknown) => ipcRenderer.invoke('insertPowerCable', data),
  updatePowerCableByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updatePowerCableByMrid', mrid, data),
  deletePowerCableByMrid: (mrid: string) => ipcRenderer.invoke('deletePowerCableByMrid', mrid)
})
