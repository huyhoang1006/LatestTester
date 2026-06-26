import { ipcRenderer } from 'electron'

export const surgeArresterJobPreload = () => ({
    insertSurgeArresterJob: (old_data: unknown, data: unknown) =>
        ipcRenderer.invoke('insertSurgeArresterJob', old_data, data),
    getSurgeArresterJobByMrid: (mrid: string) => ipcRenderer.invoke('getSurgeArresterJobByMrid', mrid),
    deleteSurgeArresterJobByMrid: (data: unknown) => ipcRenderer.invoke('deleteSurgeArresterJobByMrid', data)
})