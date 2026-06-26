import { ipcRenderer } from 'electron'

export const importPreload = () => ({
    importJSON: () => ipcRenderer.invoke('importJSON')
})