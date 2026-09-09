import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'

let importerProcess: ChildProcessWithoutNullStreams | null = null
const pendingRequests: Map<string, (value: unknown) => void> = new Map()

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function startPythonWorker(): void {
  const isWin = process.platform === 'win32'
  const exeName = isWin ? 'importer.exe' : 'importer'
  const platformFolder = isWin ? 'importer_win' : 'importer_mac'

  let exePath: string
  if (app.isPackaged) {
    exePath = path.join(
      process.resourcesPath!,
      'extra_binaries',
      'importer',
      platformFolder,
      exeName
    )
  } else {
    exePath = path.join(process.cwd(), 'extra_binaries', 'importer', platformFolder, exeName)
  }

  if (!fs.existsSync(exePath)) {
    console.warn(`[PythonWorker] Python executable not found at: ${exePath}`)
    console.warn('[PythonWorker] File conversion functionality will be unavailable')
    return
  }

  importerProcess = spawn(exePath)

  const rl = readline.createInterface({
    input: importerProcess.stdout,
    terminal: false
  })

  rl.on('line', (line: string) => {
    if (line === 'PYTHON_READY') {
      return
    }

    try {
      const response = JSON.parse(line)
      if (response.id && pendingRequests.has(response.id)) {
        const resolve = pendingRequests.get(response.id)
        if (resolve) {
          resolve(response)
        }
        pendingRequests.delete(response.id)
      }
    } catch {
      console.log('[Python] Log:', line)
    }
  })

  importerProcess.stderr.on('data', (data: Buffer) => {
    console.error(`[Python Error]: ${data.toString()}`)
  })

  importerProcess.on('error', (err) => {
    console.error('[PythonWorker] Process error:', err)
  })

  importerProcess.on('exit', () => {})
}

export function stopPythonWorker(): void {
  if (importerProcess) {
    importerProcess.stdin.write('EXIT\n')
    importerProcess.kill()
    importerProcess = null
  }
}

export function convertFiles(filePaths: string[], fileType: string): Promise<unknown>[] {
  if (!importerProcess) {
    console.warn('[PythonWorker] Python process not running, cannot convert files')
    return filePaths.map(() =>
      Promise.resolve({ success: false, message: 'Python worker not available' })
    )
  }

  return filePaths.map((filePath) => {
    return new Promise((resolve) => {
      const reqId = generateUuid()
      pendingRequests.set(reqId, resolve)

      const payload = {
        id: reqId,
        type: fileType,
        path: filePath
      }

      importerProcess!.stdin.write(JSON.stringify(payload) + '\n')
    })
  })
}
