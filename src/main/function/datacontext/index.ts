import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { getDBPassword } from '@/config/dbConfig'

const sqlite3 = require('@journeyapps/sqlcipher')

const DB_PASSWORD = getDBPassword()
const nameDB = 'database.db'

const userDataPath = app.getPath('userData')
const userDBPath = path.join(userDataPath, nameDB)

let sourceDBPath: string
if (is.dev) {
  sourceDBPath = path.join(process.cwd(), 'src/main/database', nameDB)
} else {
  sourceDBPath = path.join(process.resourcesPath, 'database', nameDB)
}

if (!fs.existsSync(userDBPath)) {
  fs.copyFileSync(sourceDBPath, userDBPath)
}

const dbPath = is.dev ? sourceDBPath : userDBPath

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('[Datacontext] Database connection error:', err.message)
  }
})

db.serialize(() => {
  db.run(`PRAGMA key = '${DB_PASSWORD}'`)
  db.run('PRAGMA foreign_keys=ON')
})

export default db
