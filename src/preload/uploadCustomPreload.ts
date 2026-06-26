import { ipcRenderer } from 'electron'

export const uploadCustomPreload = () => ({
    uploadCustom: (name: string) => ipcRenderer.invoke('uploadCustom', name),
    getNameTemplate: () => ipcRenderer.invoke('getNameTemplate'),
    uploadReport: (name: string, asset: unknown, location: unknown, job: unknown, user_id: string) =>
        ipcRenderer.invoke('uploadReport', name, asset, location, job, user_id),
    getTemplateByName: (name: string) => ipcRenderer.invoke('getTemplateByName', name),
    deleteTempByName: (name: string) => ipcRenderer.invoke('deleteTempByName', name),
    updateTempByName: (data: Record<string, unknown>) => ipcRenderer.invoke('updateTempByName', data),
    getColumnByName: (name: string) => ipcRenderer.invoke('getColumnByName', name),
    saveTemplate: (data: Record<string, unknown>) => ipcRenderer.invoke('saveTemplate', data),
    checkNameTemplateExist: (name: string) => ipcRenderer.invoke('checkNameTemplateExist', name),
    getVariableFromJson: () => ipcRenderer.invoke('getVariableFromJson'),
    exportVariableToJon: (data: unknown) => ipcRenderer.invoke('exportVariableToJon', data),
    exportReport: (file: Record<string, unknown>, location: unknown, assetType: unknown, asset: unknown, job: unknown, test: unknown, user_id: string, bushing: unknown, tap_changer: unknown) =>
        ipcRenderer.invoke('exportReport', file, location, assetType, asset, job, test, user_id, bushing, tap_changer)
})