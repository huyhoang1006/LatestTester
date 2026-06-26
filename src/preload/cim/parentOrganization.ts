import { ipcRenderer } from 'electron'

export const parentOrganizationPreload = () => ({
    insertParentOrganization: (data: unknown) => ipcRenderer.invoke('insertParentOrganization', data),
    getParentOrganizationByMrid: (mrid: string) => ipcRenderer.invoke('getParentOrganizationByMrid', mrid),
    getParentOrganizationByParentMrid: (mrid: string) => ipcRenderer.invoke('getParentOrganizationByParentMrid', mrid),
    updateParentOrganizationByMrid: (mrid: string, data: unknown) =>
        ipcRenderer.invoke('updateParentOrganizationByMrid', mrid, data),
    deleteParentOrganizationByMrid: (mrid: string) => ipcRenderer.invoke('deleteParentOrganizationByMrid', mrid)
})