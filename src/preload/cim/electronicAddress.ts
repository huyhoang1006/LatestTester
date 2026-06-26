import { ipcRenderer } from 'electron'

export const electronicAddressPreload = () => ({
    getElectronicAddressByMrid: (mrid: string) => ipcRenderer.invoke('getElectronicAddressByMrid', mrid)
})