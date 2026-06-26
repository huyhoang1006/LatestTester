import { ipcRenderer } from 'electron'

export const powerCableEntityPreload = () => ({
    insertPowerCableEntity: (old_data: unknown, data: unknown) =>
        ipcRenderer.invoke('insertPowerCableEntity', old_data, data),
    getPowerCableEntityByMrid: (mrid: string, psrId: string) =>
        ipcRenderer.invoke('getPowerCableEntityByMrid', mrid, psrId),
    deletePowerCableEntity: (data: unknown) => ipcRenderer.invoke('deletePowerCableEntity', data)
})