import { ipcRenderer } from 'electron'

export const bushingJobPreload = () => ({
  insertBushingJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertBushingJob', old_data, data),
  getBushingJobByMrid: (mrid: string) => ipcRenderer.invoke('getBushingJobByMrid', mrid),
  deleteBushingJobByMrid: (data: unknown) => ipcRenderer.invoke('deleteBushingJobByMrid', data)
})
