import { ipcRenderer } from 'electron'

export const assetPreload = () => ({
    getAssetByMrid: (mrid: string) => ipcRenderer.invoke('getAssetByMrid', mrid),
    getAssetByPsrIdAndKind: (prsId: string, kind: string) => ipcRenderer.invoke('getAssetByPsrIdAndKind', prsId, kind),
    updateAssetByMrid: (mrid: string, data: unknown) => ipcRenderer.invoke('updateAssetByMrid', mrid, data)
})