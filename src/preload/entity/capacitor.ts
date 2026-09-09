import { ipcRenderer } from 'electron'

export const capacitorEntityPreload = () => ({
  insertCapacitorEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertCapacitorEntity', old_data, data),
  getCapacitorEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getCapacitorEntityByMrid', mrid, psrId),
  deleteCapacitorEntity: (data: unknown) => ipcRenderer.invoke('deleteCapacitorEntity', data)
})
