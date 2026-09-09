import { ipcRenderer } from 'electron'

export const voltageLevelEntityPreload = () => ({
  insertVoltageLevelEntity: (data: unknown) => ipcRenderer.invoke('insertVoltageLevelEntity', data),
  getVoltageLevelEntityByMrid: (mrid: string) =>
    ipcRenderer.invoke('getVoltageLevelEntityByMrid', mrid),
  deleteVoltageLevelEntityByMrid: (data: unknown) =>
    ipcRenderer.invoke('deleteVoltageLevelEntityByMrid', data)
})
