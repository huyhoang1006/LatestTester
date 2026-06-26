import { ipcRenderer } from 'electron'

export const attachmentPreload = () => ({
    getAttachmentpath: () => ipcRenderer.invoke('getAttachmentpath'),
    insertAttachment: (attachment: unknown) => ipcRenderer.invoke('insertAttachment', attachment),
    getAttachmentById: (id_foreign: string, type: string) => ipcRenderer.invoke('getAttachmentById', id_foreign, type),
    updateAttachmentById: (id: string) => ipcRenderer.invoke('updateAttachmentById', id),
    getAttachmentByForeignIdAndType: (id_foreign: string, type: string) =>
        ipcRenderer.invoke('getAttachmentByForeignIdAndType', id_foreign, type),
    deleteAttachmentById: (id: string) => ipcRenderer.invoke('deleteAttachmentById', id),
    openFile: (path: string) => ipcRenderer.invoke('openFile', path),
    downloadFile: (path: string) => ipcRenderer.invoke('downloadFile', path),
    readFileData: (file_Path: string) => ipcRenderer.invoke('readFileData', file_Path),
    downloadFileData: (base64: string, dirFile: string) => ipcRenderer.invoke('downloadFileData', base64, dirFile)
})