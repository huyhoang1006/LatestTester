import path from 'path'
import { app } from 'electron'

const nameDB = 'database.db'

let db: any = null
let useMock = false

async function initDatabase(): Promise<any> {
  const dbPath = path.join(app.getPath('userData'), nameDB)

  try {
    const Sqlite3 = require('@journeyapps/sqlcipher')
    const DatabaseClass = (Sqlite3 as any).Database || Sqlite3.Database

    db = new DatabaseClass(dbPath)

    await new Promise<void>((resolve) => {
      db.serialize(() => {
        resolve()
      })
    })

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

export function initDatabaseIPC() {}

export { initDatabase }
