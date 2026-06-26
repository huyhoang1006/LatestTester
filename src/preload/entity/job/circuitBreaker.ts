import { ipcRenderer } from 'electron'

export const circuitBreakerJobPreload = () => ({
    insertCircuitBreakerJob: (old_data: unknown, data: unknown) =>
        ipcRenderer.invoke('insertCircuitBreakerJob', old_data, data),
    getCircuitBreakerJobByMrid: (mrid: string) => ipcRenderer.invoke('getCircuitBreakerJobByMrid', mrid),
    deleteCircuitBreakerJobByMrid: (data: unknown) => ipcRenderer.invoke('deleteCircuitBreakerJobByMrid', data)
})