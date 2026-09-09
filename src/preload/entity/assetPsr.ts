import { ipcRenderer } from 'electron'

export const assetPsrPreload = () => ({
  getAssetPsrByAssetIdAndPsrId: (assetId: string, psrId: string) =>
    ipcRenderer.invoke('getAssetPsrByAssetIdAndPsrId', assetId, psrId),
  getAssetPsrById: (mrid: string) => ipcRenderer.invoke('getAssetPsrById', mrid),
  insertAssetPsr: (data: unknown) => ipcRenderer.invoke('insertAssetPsr', data),
  updateAssetPsr: (mrid: string, data: unknown) => ipcRenderer.invoke('updateAssetPsr', mrid, data),
  deleteAssetPsrById: (mrid: string) => ipcRenderer.invoke('deleteAssetPsrById', mrid)
})
