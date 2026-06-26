import { ipcRenderer } from 'electron'

export const discretePreload = () => ({
    getDiscreteByMrid: (mrid: string) => ipcRenderer.invoke('getDiscreteByMrid', mrid),
    insertDiscrete: (data: unknown) => ipcRenderer.invoke('insertDiscrete', data),
    updateDiscrete: (mrid: string, data: unknown) => ipcRenderer.invoke('updateDiscrete', mrid, data),
    deleteDiscrete: (mrid: string) => ipcRenderer.invoke('deleteDiscrete', mrid)
})