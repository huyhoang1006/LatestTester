import { ipcRenderer } from 'electron'

export const disconnectorEntityPreload = () => ({
    insertDisconnectorEntity: (old_data: unknown, data: unknown) =>
        ipcRenderer.invoke('insertDisconnectorEntity', old_data, data),
    getDisconnectorEntityByMrid: (mrid: string, psrId: string) =>
        ipcRenderer.invoke('getDisconnectorEntityByMrid', mrid, psrId),
    deleteDisconnectorEntity: (data: unknown) => ipcRenderer.invoke('deleteDisconnectorEntity', data)
})