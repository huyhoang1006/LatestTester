import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { setMainWindow } from './window'
import { ipcCim, ipcEntity, ipcUploadCustom, ipcAppOption } from './ipcmain/index'
import { startPythonWorker, stopPythonWorker, convertFiles } from './pythonWorker'
import { initDatabase, closeDatabase, activeDatabaseIPC } from './ipcmain/database'
import { active as activeUpdater } from './update'

let win: BrowserWindow | null = null

function adjustWindowSize(): void {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    const safeWidth = Math.max(width, 640)
    const safeHeight = Math.max(height, 480)
    if (win) {
        win.setBounds({ x: 0, y: 0, width: safeWidth, height: safeHeight })
    }
}

async function createWindow(): Promise<void> {
    win = new BrowserWindow({
        show: false,
        frame: false,
        autoHideMenuBar: true,
        width: 1200,
        height: 800,
        minWidth: 640,
        minHeight: 480,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false,
            preload: join(__dirname, '../preload/index.js'),
            devTools: true,
            webSecurity: false
        }
    })

    setMainWindow(win)

    win.setMinimumSize(640, 480)

    win.once('ready-to-show', () => {
        if (win) {
            win.maximize()
            win.show()
        }
    })

    const sendWindowState = (): void => {
        if (win && !win.isDestroyed()) {
            const isMax = win.isMaximized()
            win.webContents.send('window-state-change', isMax)
        }
    }

    win.on('maximize', sendWindowState)
    win.on('unmaximize', sendWindowState)
    win.on('restore', sendWindowState)
    win.on('resized', sendWindowState)

    win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
        const levelStr = ['LOG', 'WARN', 'ERROR'][level] || 'INFO'
        console.log(`[Renderer ${levelStr}] ${message} (${sourceId}:${line})`)
    })

    win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
        console.error(`[Renderer FAIL-LOAD] ${errorCode}: ${errorDescription} URL: ${validatedURL}`)
    })

    win.webContents.on('render-process-gone', (_event, details) => {
        console.error(`[Renderer CRASHED]`, details)
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        console.log('[Main] Loading renderer URL:', process.env['ELECTRON_RENDERER_URL'])
        await win.loadURL(process.env['ELECTRON_RENDERER_URL'])
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        await win.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-quit', () => {
    stopPythonWorker()
    closeDatabase()
})

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    ipcMain.handle('closeApp', () => {
        app.quit()
    })

    ipcMain.handle('minimizeApp', () => {
        if (win) win.minimize()
    })

    ipcMain.handle('maximizeApp', () => {
        if (win) {
            win.isMaximized() ? win.unmaximize() : win.maximize()
        }
    })

    ipcMain.handle('window-state', () => {
        if (win) {
            return {
                isMaximized: win.isMaximized(),
                isMinimized: win.isMinimized(),
                isFocused: win.isFocused()
            }
        }
        return null
    })

    ipcMain.handle('convert-files', async (_event, filePaths: string[], fileType: string) => {
        return await Promise.all(convertFiles(filePaths, fileType))
    })

    ipcAppOption.active()
    ipcEntity.active()
    ipcCim.active()
    ipcUploadCustom.active()
    initDatabase()
    activeDatabaseIPC()

    await activeUpdater()

    startPythonWorker()

    await createWindow()

    screen.on('display-metrics-changed', () => {
        adjustWindowSize()
    })

    console.log('[Main] App ready and window created with IPC handlers')
})