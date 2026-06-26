import { ipcRenderer } from 'electron'

export const rotatingMachineJobPreload = () => ({
    insertRotatingMachineJob: (old_data: unknown, data: unknown) =>
        ipcRenderer.invoke('insertRotatingMachineJob', old_data, data),
    getRotatingMachineJobByMrid: (mrid: string) => ipcRenderer.invoke('getRotatingMachineJobByMrid', mrid),
    deleteRotatingMachineJobByMrid: (data: unknown) => ipcRenderer.invoke('deleteRotatingMachineJobByMrid', data)
})