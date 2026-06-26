import { ipcRenderer } from 'electron'

export const substationEntityPreload = () => ({
    insertSubstationEntity: (data: unknown) => ipcRenderer.invoke('insertSubstationEntity', data),
    getSubstationEntityByMrid: (mrid: string, user_id: string, organisation_id: string) =>
        ipcRenderer.invoke('getSubstationEntityByMrid', mrid, user_id, organisation_id),
    deleteSubstationEntityByMrid: (data: unknown) => ipcRenderer.invoke('deleteSubstationEntityByMrid', data)
})