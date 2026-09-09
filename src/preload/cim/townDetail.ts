import { ipcRenderer } from 'electron'

export const townDetailPreload = () => ({
  getTownDetailByMrid: (mrid: string) => ipcRenderer.invoke('getTownDetailByMrid', mrid)
})
