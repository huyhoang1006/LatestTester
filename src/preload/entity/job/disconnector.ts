import { ipcRenderer } from 'electron'

export const disconnectorJobPreload = () => ({
  insertDisconnectorJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertDisconnectorJob', old_data, data),
  getDisconnectorJobByMrid: (mrid: string) => ipcRenderer.invoke('getDisconnectorJobByMrid', mrid),
  deleteDisconnectorJobByMrid: (data: unknown) =>
    ipcRenderer.invoke('deleteDisconnectorJobByMrid', data)
})
