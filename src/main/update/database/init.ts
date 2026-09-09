import { INIT_SCHEMA } from '../../config/database/schema'
import db from '../../function/datacontext/index'

type SqlCipherDatabase = {
  exec: (sql: string, callback: (err: Error | null) => void) => void
  get: (sql: string, callback: (err: Error | null, row: any) => void) => void
  run: (sql: string, callback: (this: unknown, err: Error | null) => void) => void
}

export const initializeDatabaseFromSQL = async (
  dbsql: SqlCipherDatabase = db as any
): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      dbsql.exec(INIT_SCHEMA, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  } catch (err) {
    console.error('[DB Init] ❌ Failed to initialize database:', err)
    throw err
  }
}

export const getDbVersion = async (dbsql: SqlCipherDatabase = db as any): Promise<number> => {
  return new Promise((resolve, reject) => {
    dbsql.get('PRAGMA user_version', (err, row) => {
      if (err) reject(err)
      else resolve(row?.user_version ?? 0)
    })
  })
}

export const setDbVersion = async (
  dbsql: SqlCipherDatabase = db as any,
  version: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    dbsql.run(`PRAGMA user_version = ${version}`, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export const updateDatabaseFromSQL = async (
  _dbsql: SqlCipherDatabase = db as any,
  _oldVersion: number,
  _newVersion: number
): Promise<void> => {}
