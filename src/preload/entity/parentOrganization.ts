import { ipcRenderer } from 'electron'

export const parentOrganizationEntityPreload = () => ({
  insertParentOrganizationEntity: (data: unknown) =>
    ipcRenderer.invoke('insertParentOrganizationEntity', data),
  insertParentOrganizationEntityFromServer: (data: unknown, serverData: unknown) =>
    ipcRenderer.invoke('insertParentOrganizationEntityFromServer', data, serverData),
  getOrganisationEntityByMrid: (mrid: string) =>
    ipcRenderer.invoke('getOrganisationEntityByMrid', mrid),
  deleteParentOrganizationEntity: (data: unknown) =>
    ipcRenderer.invoke('deleteParentOrganizationEntity', data)
})
