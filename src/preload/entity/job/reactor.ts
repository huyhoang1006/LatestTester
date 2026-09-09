import { ipcRenderer } from 'electron'

export const reactorJobPreload = () => ({
  insertReactorJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertReactorJob', old_data, data),
  getReactorJobByMrid: (mrid: string) => ipcRenderer.invoke('getReactorJobByMrid', mrid),
  deleteReactorJobByMrid: (data: unknown) => ipcRenderer.invoke('deleteReactorJobByMrid', data)
})
