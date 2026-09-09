'use strict'
import { ipcRenderer } from 'electron'

export const compareTestPreload = () => {
  return {
    getComparableTests: (assetMrid, testCode, excludeWorkMrid) =>
      ipcRenderer.invoke('getComparableTests', { assetMrid, testCode, excludeWorkMrid }),
    getTestSnapshot: (workTaskMrid) => ipcRenderer.invoke('getTestSnapshot', workTaskMrid)
  }
}
