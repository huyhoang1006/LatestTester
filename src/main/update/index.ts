import { app } from 'electron'
import * as rootOrganisationFunc from './organisationRoot/index'
import * as databaseInitFunc from './database/init'
import db from '../function/datacontext/index'

const LATEST_DB_VERSION = 1

const runAsync = (sql: string, dbsql: any = db): Promise<void> => {
  return new Promise((resolve, reject) => {
    dbsql.run(sql, function (this: unknown, err: Error | null) {
      if (err) reject(err)
      else resolve()
    })
  })
}

export const createRootOrganisation = async (): Promise<void> => {
  try {
    const check = await rootOrganisationFunc.createOrganisationRoot(db)
    if (!check.success) {
      console.warn('[Update] ⚠️ Create root organisation did not succeed:', check.message)
    }
  } catch (err: any) {
    console.error('[Update] ❌ Error creating root organisation:', err?.message || err)
  }
}

export const updateDatabase = async (): Promise<void> => {
  try {
    const oldVersion = await databaseInitFunc.getDbVersion(db)
    if (!oldVersion) {
      console.warn(
        '[Update] No version found in database. Assuming first run. Initializing schema...'
      )
      try {
        await runAsync('BEGIN TRANSACTION', db)
        await databaseInitFunc.initializeDatabaseFromSQL(db)
        await runAsync('COMMIT', db)
        await databaseInitFunc.setDbVersion(db, LATEST_DB_VERSION)
      } catch (err: any) {
        await runAsync('ROLLBACK', db)
        console.error('[Update] ❌ Error initializing database on first run:', err?.message || err)
        throw err
      }
    } else if (LATEST_DB_VERSION > oldVersion) {
      try {
        await runAsync('BEGIN TRANSACTION', db)
        await databaseInitFunc.updateDatabaseFromSQL(db, oldVersion, LATEST_DB_VERSION)
        await runAsync('COMMIT', db)
        await databaseInitFunc.setDbVersion(db, LATEST_DB_VERSION)
      } catch (err: any) {
        await runAsync('ROLLBACK', db)
        console.error('[Update] ❌ Error upgrading database:', err?.message || err)
        throw err
      }
    } else {
      // Database already at current version
    }
  } catch (err: any) {
    console.error('[Update] ❌ updateDatabase failed:', err?.message || err)
    try {
      app.quit()
    } catch (_) {
      /* noop */
    }
  }
}

export const active = async (): Promise<void> => {
  try {
    await updateDatabase()
    await createRootOrganisation()
  } catch (err: any) {
    console.error('[Update] ❌ Startup sequence failed:', err?.message || err)
  }
}
