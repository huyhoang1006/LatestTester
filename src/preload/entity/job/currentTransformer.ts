import { ipcRenderer } from 'electron'

export const currentTransformerJobPreload = () => ({
  insertCurrentTransformerJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertCurrentTransformerJob', old_data, data),
  getCurrentTransformerJobByMrid: (mrid: string) =>
    ipcRenderer.invoke('getCurrentTransformerJobByMrid', mrid),
  deleteCurrentTransformerJobByMrid: (data: unknown) =>
    ipcRenderer.invoke('deleteCurrentTransformerJobByMrid', data)
})
