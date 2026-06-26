import { ipcRenderer } from 'electron'

export const rotatingMachineEntityPreload = () => ({
    insertRotatingMachineEntity: (old_data: unknown, data: unknown) =>
        ipcRenderer.invoke('insertRotatingMachineEntity', old_data, data),
    getRotatingMachineEntityByMrid: (mrid: string, psrId: string) =>
        ipcRenderer.invoke('getRotatingMachineEntityByMrid', mrid, psrId),
    deleteRotatingMachineEntity: (data: unknown) => ipcRenderer.invoke('deleteRotatingMachineEntity', data)
})