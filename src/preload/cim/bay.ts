import { ipcRenderer } from 'electron'

export const bayPreload = () => ({
    getBayByMrid: (mrid: string) => ipcRenderer.invoke('getBayByMrid', mrid),
    insertBay: (data: unknown) => ipcRenderer.invoke('insertBay', data),
    getBayByVoltageBySubstationId: (voltage_level: string, substationId: string) =>
        ipcRenderer.invoke('getBayByVoltageBySubstationId', voltage_level, substationId),
    updateBayByMrid: (mrid: string, data: unknown) => ipcRenderer.invoke('updateBayByMrid', mrid, data),
    deleteBayByMrid: (mrid: string) => ipcRenderer.invoke('deleteBayByMrid', mrid)
})