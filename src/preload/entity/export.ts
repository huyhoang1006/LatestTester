import { ipcRenderer } from 'electron'

export const exportPreload = () => ({
    exportJSON: (payload: unknown, options: unknown) => ipcRenderer.invoke('exportJSON', payload, options)
})