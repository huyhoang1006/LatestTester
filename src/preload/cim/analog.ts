import { ipcRenderer } from 'electron'

export const analogPreload = () => ({
    getAnalogByMrid: (mrid: string) => ipcRenderer.invoke('getAnalogByMrid', mrid),
    getAllAnalogByProcedure: (procedureId: string) => ipcRenderer.invoke('getAllAnalogByProcedure', procedureId),
    insertAnalog: (data: unknown) => ipcRenderer.invoke('insertAnalog', data),
    deleteAnalogByMrid: (mrid: string) => ipcRenderer.invoke('deleteAnalogByMrid', mrid)
})