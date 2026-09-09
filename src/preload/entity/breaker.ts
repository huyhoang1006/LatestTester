import { ipcRenderer } from 'electron'

export const breakerEntityPreload = () => ({
  insertBreakerEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertBreakerEntity', old_data, data),
  getBreakerEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getBreakerEntityByMrid', mrid, psrId),
  deleteBreakerEntity: (data: unknown) => ipcRenderer.invoke('deleteBreakerEntity', data)
})
