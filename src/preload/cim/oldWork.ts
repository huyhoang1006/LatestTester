import { ipcRenderer } from 'electron'

export const oldWorkPreload = () => ({
  getOldWorkByMrid: (mrid: string) => ipcRenderer.invoke('getOldWorkByMrid', mrid),
  getOldWorkByAssetId: (assetId: string) => ipcRenderer.invoke('getOldWorkByAssetId', assetId)
})
