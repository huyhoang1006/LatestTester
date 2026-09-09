import { ipcRenderer } from 'electron'

export const substationPreload = () => ({
  getSubstationByMrid: (mrid: string) => ipcRenderer.invoke('getSubstationByMrid', mrid),
  getSubstationsInOrganisationForUser: (mrid: string, user_id: string) =>
    ipcRenderer.invoke('getSubstationsInOrganisationForUser', mrid, user_id),
  insertSubstation: (data: unknown) => ipcRenderer.invoke('insertSubstation', data),
  updateSubstationByMrid: (mrid: string, data: unknown) =>
    ipcRenderer.invoke('updateSubstationByMrid', mrid, data),
  deleteSubstationByMrid: (mrid: string) => ipcRenderer.invoke('deleteSubstationByMrid', mrid)
})
