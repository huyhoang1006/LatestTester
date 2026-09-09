import { ipcRenderer } from 'electron'

export const surgeArresterPreload = () => ({
  getSurgeArresterByMrid: (mrid: string) => ipcRenderer.invoke('getSurgeArresterByMrid', mrid),
  getSurgeArresterByPsrId: (psrId: string) => ipcRenderer.invoke('getSurgeArresterByPsrId', psrId)
})
