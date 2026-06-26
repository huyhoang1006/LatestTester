import { ipcRenderer } from 'electron'

export const voltageLevelPreload = () => ({
    getVoltageLevelByMrid: (mrid: string) => ipcRenderer.invoke('getVoltageLevelByMrid', mrid),
    getVoltageLevelBySubstationId: (substationId: string) => ipcRenderer.invoke('getVoltageLevelBySubstationId', substationId),
    insertVoltageLevel: (data: unknown) => ipcRenderer.invoke('insertVoltageLevel', data),
    updateVoltageLevelByMrid: (mrid: string, data: unknown) => ipcRenderer.invoke('updateVoltageLevelByMrid', mrid, data),
    deleteVoltageLevelByMrid: (mrid: string) => ipcRenderer.invoke('deleteVoltageLevelByMrid', mrid)
})