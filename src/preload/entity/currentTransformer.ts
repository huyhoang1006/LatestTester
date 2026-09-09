import { ipcRenderer } from 'electron'

export const currentTransformerEntityPreload = () => ({
  insertCurrentTransformerEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertCurrentTransformerEntity', old_data, data),
  getCurrentTransformerEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getCurrentTransformerEntityByMrid', mrid, psrId),
  deleteCurrentTransformerEntity: (data: unknown) =>
    ipcRenderer.invoke('deleteCurrentTransformerEntity', data)
})
