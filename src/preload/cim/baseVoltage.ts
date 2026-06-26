import { ipcRenderer } from 'electron'

export const baseVoltagePreload = () => ({
    getBaseVoltageByMrid: (mrid: string) => ipcRenderer.invoke('getBaseVoltageByMrid', mrid)
})