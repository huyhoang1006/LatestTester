import { ipcRenderer } from 'electron'

export const appOptionPreload = () => ({
  minimizeApp: () => ipcRenderer.invoke('minimizeApp'),
  closeApp: () => ipcRenderer.invoke('closeApp'),
  maximizeApp: () => ipcRenderer.invoke('maximizeApp'),
  openFileDialog: (type: string) => ipcRenderer.invoke('openFileDialog', type)
})
