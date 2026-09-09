import { ipcRenderer } from 'electron'

export const voltageTransformerEntityPreload = () => ({
  insertVoltageTransformerEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertVoltageTransformerEntity', old_data, data),
  getVoltageTransformerEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getVoltageTransformerEntityByMrid', mrid, psrId),
  deleteVoltageTransformerEntity: (data: unknown) =>
    ipcRenderer.invoke('deleteVoltageTransformerEntity', data)
})
