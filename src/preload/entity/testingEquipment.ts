import { ipcRenderer } from 'electron'

export const testingEquipmentEntityPreload = () => ({
  insertTestingEquipmentEntity: (old_data: unknown, data: unknown) =>
    ipcRenderer.invoke('insertTestingEquipmentEntity', old_data, data),
  getAllTestingEquipmentList: (userId: string) =>
    ipcRenderer.invoke('getAllTestingEquipmentList', userId),
  getAllAccessories: () => ipcRenderer.invoke('getAllAccessories'),
  getTestingEquipmentEntityByMrid: (mrid: string) =>
    ipcRenderer.invoke('getTestingEquipmentEntityByMrid', mrid),
  getTestingEquipmentUsage: (mrid: string) => ipcRenderer.invoke('getTestingEquipmentUsage', mrid),
  deleteTestingEquipmentEntity: (mrid: string) =>
    ipcRenderer.invoke('deleteTestingEquipmentEntity', mrid)
})
