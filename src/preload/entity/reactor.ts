import { ipcRenderer } from 'electron'

export const reactorEntityPreload = () => ({
  insertReactorEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertReactorEntity', old_data, data),
  getReactorEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getReactorEntityByMrid', mrid, psrId),
  deleteReactorEntity: (data: unknown) => ipcRenderer.invoke('deleteReactorEntity', data)
})
