'use strict'
import { ipcRenderer } from 'electron'

export const auditLogPreload = () => {
  return {
    writeAuditLogEntry: (options) => ipcRenderer.invoke('writeAuditLogEntry', options)
  }
}
