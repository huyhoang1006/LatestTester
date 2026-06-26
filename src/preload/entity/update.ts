import { ipcRenderer } from 'electron'

export const updateEntityPreload = () => ({
    checkForUpdate: () => ipcRenderer.invoke('checkForUpdate'),
    downloadUpdate: () => ipcRenderer.invoke('downloadUpdate'),
    installUpdate: () => ipcRenderer.invoke('installUpdate'),
    onUpdateAvailable: (callback: (data: unknown) => void) =>
        ipcRenderer.on('update-available', (_event, data) => callback(data)),
    onUpdateNotAvailable: (callback: (data: unknown) => void) =>
        ipcRenderer.on('update-not-available', (_event, data) => callback(data)),
    onUpdateError: (callback: (data: unknown) => void) =>
        ipcRenderer.on('update-error', (_event, data) => callback(data)),
    onDownloadProgress: (callback: (data: unknown) => void) =>
        ipcRenderer.on('download-progress', (_event, data) => callback(data)),
    onUpdateDownloaded: (callback: (data: unknown) => void) =>
        ipcRenderer.on('update-downloaded', (_event, data) => callback(data)),
    onAutoUpdaterLog: (callback: (data: unknown) => void) =>
        ipcRenderer.on('auto-updater-log', (_event, data) => callback(data))
})