import path from 'path'
import { app, ipcMain } from 'electron'

const nameDB = 'database.db'

let db: any = null
let useMock = false

async function initDatabase(): Promise<any> {
    const dbPath = path.join(app.getPath('userData'), nameDB)
    console.log('[DB] Using development database path:', dbPath)

    try {
        const Sqlite3 = require('@journeyapps/sqlcipher')
        const DatabaseClass = (Sqlite3 as any).Database || Sqlite3.Database
        console.log('[DB] Database constructor:', typeof DatabaseClass)

        db = new DatabaseClass(dbPath)

        await new Promise<void>((resolve) => {
            db.serialize(() => {
                resolve()
            })
        })

        console.log('[DB] Database opened successfully')
        return db
    } catch (err: any) {
        console.error('[DB] Failed to load native sqlcipher:', err.message)
        console.log('[DB] Falling back to mock database')
        useMock = true
        return null
    }
}

export { db, useMock }

export function closeDatabase() {
    if (db && !useMock) {
        db.close()
    }
}

export function dbRun(sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> {
    if (useMock || !db) return Promise.resolve({ lastID: 0, changes: 0 })
    return new Promise((resolve, reject) => {
        db.run(sql, params as any[], function(this: { lastID: number; changes: number }, err: Error | null) {
            if (err) reject(err)
            else resolve(this)
        })
    })
}

export function dbGet(sql: string, params: unknown[] = []): Promise<unknown> {
    if (useMock || !db) return Promise.resolve(null)
    return new Promise((resolve, reject) => {
        db.get(sql, params as any[], (err: Error | null, row: unknown) => {
            if (err) reject(err)
            else resolve(row)
        })
    })
}

export function dbAll(sql: string, params: unknown[] = []): Promise<unknown[]> {
    if (useMock || !db) return Promise.resolve([])
    return new Promise((resolve, reject) => {
        db.all(sql, params as any[], (err: Error | null, rows: unknown[]) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })
}

export function activeDatabaseIPC() {
    ipcMain.handle('db-run', async (_event, sql: string, params: unknown[]) => {
        return await dbRun(sql, params)
    })

    ipcMain.handle('db-get', async (_event, sql: string, params: unknown[]) => {
        return await dbGet(sql, params)
    })

    ipcMain.handle('db-all', async (_event, sql: string, params: unknown[]) => {
        return await dbAll(sql, params)
    })

    console.log('[DB IPC] Database IPC handlers registered')
}

export { initDatabase }