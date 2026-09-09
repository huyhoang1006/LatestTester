import { ipcRenderer } from 'electron'

export const transformerEntityPreload = () => ({
  insertTransformerEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertTransformerEntity', old_data, data),
  getTransformerEntityByMrid: (mrid: string, psr_id: string) =>
    ipcRenderer.invoke('getTransformerEntityByMrid', mrid, psr_id),
  deleteTransformerEntity: (data: unknown) => ipcRenderer.invoke('deleteTransformerEntity', data)
})
