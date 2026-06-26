import { ipcRenderer } from 'electron'

export const valueToAliasPreload = () => ({
    getValueToAliasByMrid: (mrid: string) => ipcRenderer.invoke('getValueToAliasByMrid', mrid)
})