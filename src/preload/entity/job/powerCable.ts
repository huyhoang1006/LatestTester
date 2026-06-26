import { ipcRenderer } from 'electron'

export const powerCableJobPreload = () => ({
    insertPowerCableJob: (old_data: unknown, data: unknown) => ipcRenderer.invoke('insertPowerCableJob', old_data, data),
    getPowerCableJobByMrid: (mrid: string) => ipcRenderer.invoke('getPowerCableJobByMrid', mrid),
    deletePowerCableJobByMrid: (data: unknown) => ipcRenderer.invoke('deletePowerCableJobByMrid', data)
})