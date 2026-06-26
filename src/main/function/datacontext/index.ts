import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

const sqlite3 = require('@journeyapps/sqlcipher')

const DB_PASSWORD = 'attester'
const nameDB = 'database.db'

const userDataPath = app.getPath('userData')
const userDBPath = path.join(userDataPath, nameDB)

let sourceDBPath: string
if (is.dev) {
    sourceDBPath = path.join(process.cwd(), 'src/main/database', nameDB)
    console.log('[Datacontext] Using development database path:', sourceDBPath)
} else {
    sourceDBPath = path.join(process.resourcesPath, 'database', nameDB)
}

if (!fs.existsSync(userDBPath)) {
    console.log('[Datacontext] Copying database from source to userData...')
    fs.copyFileSync(sourceDBPath, userDBPath)
}

const dbPath = is.dev ? sourceDBPath : userDBPath

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
        console.error('[Datacontext] Database connection error:', err.message)
    } else {
        console.log('[Datacontext] Database connected successfully!')
    }
})

db.serialize(() => {
    db.run(`PRAGMA key = '${DB_PASSWORD}'`)
    db.run('PRAGMA foreign_keys=ON')
})

export default db
