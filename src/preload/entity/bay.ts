import { ipcRenderer } from 'electron'

export const bayEntityPreload = () => ({
  insertBayEntity: (data: unknown) => ipcRenderer.invoke('insertBayEntity', data),
  getBayEntityByMrid: (mrid: string) => ipcRenderer.invoke('getBayEntityByMrid', mrid),
  deleteBayEntityByMrid: (data: unknown) => ipcRenderer.invoke('deleteBayEntityByMrid', data)
})
