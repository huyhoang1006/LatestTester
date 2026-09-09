import { ipcRenderer } from 'electron'

export const stringMeasurementPreload = () => ({
  getStringMeasurementByMrid: (mrid: string) =>
    ipcRenderer.invoke('getStringMeasurementByMrid', mrid),
  insertStringMeasurement: (data: unknown) => ipcRenderer.invoke('insertStringMeasurement', data),
  updateStringMeasurement: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateStringMeasurement', mrid, data),
  deleteStringMeasurement: (mrid: string) => ipcRenderer.invoke('deleteStringMeasurement', mrid)
})
