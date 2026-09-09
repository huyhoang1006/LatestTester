import { ipcRenderer } from 'electron'

export const productAssetModelPreload = () => ({
  getProductAssetModelByMrid: (mrid: string) =>
    ipcRenderer.invoke('getProductAssetModelByMrid', mrid),
  insertProductAssetModel: (data: unknown) => ipcRenderer.invoke('insertProductAssetModel', data),
  updateProductAssetModelByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateProductAssetModelByMrid', mrid, data),
  deleteProductAssetModelByMrid: (mrid: string) =>
    ipcRenderer.invoke('deleteProductAssetModelByMrid', mrid)
})
