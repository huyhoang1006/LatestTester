import { ipcRenderer } from 'electron'

export const positionPointPreload = () => ({
    getPositionPointByMrid: (mrid: string) => ipcRenderer.invoke('getPositionPointByMrid', mrid),
    getPositionPointByLocationId: (locationId: string) => ipcRenderer.invoke('getPositionPointByLocationId', locationId)
})