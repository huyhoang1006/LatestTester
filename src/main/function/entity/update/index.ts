import { autoUpdater } from 'electron-updater'
import { getMainWindow } from '@/window'
import { entityFunc } from '@/function'

const sendToRenderer = (...args: unknown[]) => {
  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('auto-updater-log', args.join(' '))
  }
}

autoUpdater.logger = {
  info: (...args: unknown[]) => sendToRenderer('[AutoUpdater]', ...args),
  warn: (...args: unknown[]) => sendToRenderer('[AutoUpdater]', ...args),
  error: (...args: unknown[]) => sendToRenderer('[AutoUpdater]', ...args)
}

autoUpdater.forceDevUpdateConfig = true
autoUpdater.autoDownload = false

autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://disparately-nonrationalistic-hope.ngrok-free.dev'
})

autoUpdater.on('download-progress', (progressObj: any) => {
  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('download-progress', progressObj)
  }
})

autoUpdater.on('update-available', async (info: any) => {
  await createUpdateNotificationInDB(info)

  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('update-available', info)
  }
})

async function createUpdateNotificationInDB(info: any) {
  try {
    const { v4: uuid } = await import('uuid')
    const notificationId = uuid()

    const notification = {
      mrid: notificationId,
      name: 'Update Available',
      message: `Version ${info.version} is ready to install.`,
      type: 'info',
      status: 'unread',
      created_at: new Date().toISOString()
    }

    await entityFunc.notificationEntityFunc.insertNotification(notification)
  } catch (err) {
    console.error('[AutoUpdater] ❌ Error creating notification:', err)
  }
}

autoUpdater.on('update-not-available', (info: any) => {
  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('update-not-available', info)
  }
})

autoUpdater.on('error', (err: Error) => {
  console.error('[AutoUpdater] Error:', err)
  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('update-error', err)
  }
})

export async function checkForUpdates() {
  return await autoUpdater.checkForUpdates()
}

export const autoCheckForUpdates = () => {
  setTimeout(async () => {
    try {
      await autoUpdater.checkForUpdates()
    } catch (err) {
      console.error('[AutoUpdater] Auto check failed:', err)
    }
  }, 5000)
}

export async function downloadUpdate() {
  try {
    return await autoUpdater.downloadUpdate()
  } catch (error) {
    console.error('[Update] Download failed:', error)
    throw error
  }
}

autoUpdater.on('update-downloaded', (info: any) => {
  const win = getMainWindow()
  if (win && !win.isDestroyed()) {
    win.webContents.send('update-downloaded', info)
  }

  autoUpdater.autoRunAppAfterInstall = true
  autoUpdater.quitAndInstall(false, true)
})
