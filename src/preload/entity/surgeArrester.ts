import { ipcRenderer } from 'electron'

export const surgeArresterEntityPreload = () => ({
  insertSurgeArresterEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertSurgeArresterEntity', old_data, data),
  getSurgeArresterEntityByMrid: (mrid: string, psrId: string) =>
    ipcRenderer.invoke('getSurgeArresterEntityByMrid', mrid, psrId),
  deleteSurgeArresterEntity: (data: unknown) =>
    ipcRenderer.invoke('deleteSurgeArresterEntity', data)
})
