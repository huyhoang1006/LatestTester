import { ipcRenderer } from 'electron'

export const telephoneNumberPreload = () => ({
    getTelephoneNumberByMrid: (mrid: string) => ipcRenderer.invoke('getTelephoneNumberByMrid', mrid)
})