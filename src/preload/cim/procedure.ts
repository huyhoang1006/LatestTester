import { ipcRenderer } from 'electron'

export const procedurePreload = () => ({
  getProcedureByGenericAssetModel: (generic_asset_model: string) =>
    ipcRenderer.invoke('getProcedureByGenericAssetModel', generic_asset_model)
})
