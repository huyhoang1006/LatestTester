import { ipcRenderer } from 'electron'

export const transformerJobPreload = () => ({
  insertTransformerJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertTransformerJob', old_data, data),
  getTransformerJobByMrid: (mrid: string) => ipcRenderer.invoke('getTransformerJobByMrid', mrid),
  deleteTransformerJobByMrid: (data: unknown) =>
    ipcRenderer.invoke('deleteTransformerJobByMrid', data)
})
