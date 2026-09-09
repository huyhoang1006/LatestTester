import { ipcRenderer } from 'electron'

export const capacitorJobPreload = () => ({
  insertCapacitorJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertCapacitorJob', old_data, data),
  getCapacitorJobByMrid: (mrid: string) => ipcRenderer.invoke('getCapacitorJobByMrid', mrid),
  deleteCapacitorJobByMrid: (data: unknown) => ipcRenderer.invoke('deleteCapacitorJobByMrid', data)
})
