import { ipcRenderer } from 'electron'

export const bushingPreload = () => ({
  getBushingByMrid: (mrid: string) => ipcRenderer.invoke('getBushingByMrid', mrid),
  getBushingByPsrId: (mrid: string) => ipcRenderer.invoke('getBushingByPsrId', mrid)
})
