import { BrowserWindow } from 'electron'

let win: BrowserWindow | null = null

export function setMainWindow(window: BrowserWindow): void {
  win = window
}

export function getMainWindow(): BrowserWindow | null {
  return win
}
