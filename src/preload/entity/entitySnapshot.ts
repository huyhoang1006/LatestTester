import { ipcRenderer } from 'electron'

export const entitySnapshotPreload = () => ({
    getEntitySnapshotByMrid: (mrid: string, type: string) =>
        ipcRenderer.invoke('getEntitySnapshotByMrid', mrid, type),
    insertEntitySnapshot: (data: unknown) => ipcRenderer.invoke('insertEntitySnapshot', data),
    deleteEntitySnapshotByMrid: (mrid: string) => ipcRenderer.invoke('deleteEntitySnapshotByMrid', mrid)
})