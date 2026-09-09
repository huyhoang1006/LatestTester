import { ipcRenderer } from 'electron'

export const valueAliasSetPreload = () => ({
  getValueAliasSetByMrid: (mrid: string) => ipcRenderer.invoke('getValueAliasSetByMrid', mrid),
  getValueAliasSetByMrids: (mrids: string[]) =>
    ipcRenderer.invoke('getValueAliasSetByMrids', mrids),
  getValueAliasSetAndValueToAliasByMrid: (mrid: string) =>
    ipcRenderer.invoke('getValueAliasSetAndValueToAliasByMrid', mrid)
})
