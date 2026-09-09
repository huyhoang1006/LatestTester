import { ipcRenderer } from 'electron'

export const voltageTransformerJobPreload = () => ({
  insertVoltageTransformerJob: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertVoltageTransformerJob', old_data, data),
  getVoltageTransformerJobByMrid: (mrid: string) =>
    ipcRenderer.invoke('getVoltageTransformerJobByMrid', mrid),
  deleteVoltageTransformerJobByMrid: (data: unknown) =>
    ipcRenderer.invoke('deleteVoltageTransformerJobByMrid', data)
})
