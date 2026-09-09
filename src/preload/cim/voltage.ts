import { ipcRenderer } from 'electron'

export const voltagePreload = () => ({
  getVoltageByMrid: (mrid: string) => ipcRenderer.invoke('getVoltageByMrid', mrid)
})
