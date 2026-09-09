import { ipcRenderer } from 'electron'

export const uploadCustomPreload = () => ({
  uploadCustom: (name: string) => ipcRenderer.invoke('uploadCustom', name),
  getNameTemplate: () => ipcRenderer.invoke('getNameTemplate'),
  uploadReport: (name: string, asset: unknown, location: unknown, job: unknown, user_id: string) =>
    ipcRenderer.invoke('uploadReport', name, asset, location, job, user_id),
  getTemplateByName: (name: string) => ipcRenderer.invoke('getTemplateByName', name),
  deleteTempByName: (name: string) => ipcRenderer.invoke('deleteTempByName', name),
  updateTempByName: (data: Record<string, unknown>) => ipcRenderer.invoke('updateTempByName', data),
  getColumnByName: (name: string) => ipcRenderer.invoke('getColumnByName', name),
  saveTemplate: (data: Record<string, unknown>) => ipcRenderer.invoke('saveTemplate', data),
  checkNameTemplateExist: (name: string) => ipcRenderer.invoke('checkNameTemplateExist', name),
  getVariableFromJson: () => ipcRenderer.invoke('getVariableFromJson'),
  exportVariableToJon: (data: unknown) => ipcRenderer.invoke('exportVariableToJon', data),
  exportReport: (
    file: Record<string, unknown>,
    location: unknown,
    assetType: unknown,
    asset: unknown,
    job: unknown,
    test: unknown,
    user_id: string,
    bushing: unknown,
    tap_changer: unknown
  ) =>
    ipcRenderer.invoke(
      'exportReport',
      file,
      location,
      assetType,
      asset,
      job,
      test,
      user_id,
      bushing,
      tap_changer
    ),
  importJSON: () => ipcRenderer.invoke('importJSON'),
  exportJSON: (data: unknown, options?: { defaultFileName?: string; title?: string }) =>
    ipcRenderer.invoke('exportJSON', data, options || {}),
  pickExcelFileForImport: () => ipcRenderer.invoke('pickExcelFileForImport'),
  pickWordFileForImport: () => ipcRenderer.invoke('pickWordFileForImport'),
  readExcelForImport: (payload: { filePath: string; templatePath?: string; variables: any[] }) =>
    ipcRenderer.invoke('readExcelForImport', payload),
  readWordForImport: (payload: { filePath: string; templatePath?: string; variables: any[] }) =>
    ipcRenderer.invoke('readWordForImport', payload),
  openFileTemplate: (filePath: string) => ipcRenderer.invoke('openFileTemplate', filePath),
  getAllTemplates: () => ipcRenderer.invoke('getAllTemplates'),
  getAllTemplatesByType: (type: string, category: string) =>
    ipcRenderer.invoke('getAllTemplatesByType', type, category),
  insertTemplate: (data: any) => ipcRenderer.invoke('insertTemplate', data),
  updateTemplate: (data: any) => ipcRenderer.invoke('updateTemplate', data),
  saveTemplateWithScan: (payload: any) => ipcRenderer.invoke('saveTemplateWithScan', payload),
  exportTemplateWithData: (payload: any) => ipcRenderer.invoke('exportTemplateWithData', payload),
  exportWordWithData: (payload: any) => ipcRenderer.invoke('exportWordWithData', payload),
  scanTemplateCoordinates: (payload: any) => ipcRenderer.invoke('scanTemplateCoordinates', payload),
  checkMridsExist: (items: any[]) => ipcRenderer.invoke('checkMridsExist', items),
  resolveMridPath: (mrid: string, mode: string) =>
    ipcRenderer.invoke('resolveMridPath', { mrid, mode })
})
