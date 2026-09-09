import { ipcRenderer } from 'electron'

export const personPreload = () => ({
  getPersonByMrid: (mrid: string) => ipcRenderer.invoke('getPersonByMrid', mrid),
  getPersonByOrganisationId: (organisationId: string) =>
    ipcRenderer.invoke('getPersonByOrganisationId', organisationId),
  insertPerson: (data: unknown) => ipcRenderer.invoke('insertPerson', data),
  updatePersonByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updatePersonByMrid', mrid, data),
  deletePersonByMrid: (mrid: string) => ipcRenderer.invoke('deletePersonByMrid', mrid)
})
