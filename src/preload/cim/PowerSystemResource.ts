import { ipcRenderer } from 'electron'

export const powerSystemResourcePreload = () => ({
    getPowerSystemResourceByMrid: (mrid: string) => ipcRenderer.invoke('getPowerSystemResourceByMrid', mrid),
    getLocationByPowerSystemResourceMrid: (mrid: string) =>
        ipcRenderer.invoke('getLocationByPowerSystemResourceMrid', mrid),
    insertPowerSystemResource: (data: unknown) => ipcRenderer.invoke('insertPowerSystemResource', data),
    updatePowerSystemResourceByMrid: (mrid: string, data: unknown) =>
        ipcRenderer.invoke('updatePowerSystemResourceByMrid', mrid, data),
    deletePowerSystemResourceByMrid: (mrid: string) => ipcRenderer.invoke('deletePowerSystemResourceByMrid', mrid)
})