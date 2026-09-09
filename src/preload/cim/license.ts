import { ipcRenderer } from 'electron'

export const licensePreload = () => ({
  checkLicense: (name: string) => ipcRenderer.invoke('checkLicenseLimitation', name),
  updateLicense: (name: string, limit: number) =>
    ipcRenderer.invoke('updateLicenseLimit', name, limit),
  getAllLicenses: () => ipcRenderer.invoke('getAllLicenses')
})
