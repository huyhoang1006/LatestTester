import { ipcRenderer } from 'electron'

export const bushingEntityPreload = () => ({
  insertBushingEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertBushingEntity', old_data, data),
  getBushingEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getBushingEntityByMrid', mrid, psrId),
  deleteBushingEntity: (data: unknown) => ipcRenderer.invoke('deleteBushingEntity', data)
})
