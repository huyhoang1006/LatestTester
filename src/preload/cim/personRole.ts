import { ipcRenderer } from 'electron'

export const personRolePreload = () => ({
  getPersonRoleByMrid: (mrid: string) => ipcRenderer.invoke('getPersonRoleByMrid', mrid),
  getPersonRoleByPersonId: (personId: string) =>
    ipcRenderer.invoke('getPersonRoleByPersonId', personId)
})
