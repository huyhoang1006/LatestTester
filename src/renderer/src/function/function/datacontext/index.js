'use strict'

console.log('[Datacontext] Using IPC for database access')

let db

function createIPCProxy() {
    const handlers = {
        serialize: (callback) => callback(),
        run: (sql, params, callback) => {
            if (typeof params === 'function') { callback = params; params = []; }
            window.electronAPI.dbRun(sql, params)
                .then(() => { if (callback) callback() })
                .catch((err) => { console.error('[DB IPC] run error:', err); if (callback) callback(err) })
            return handlers
        },
        get: (sql, params, callback) => {
            if (typeof params === 'function') { callback = params; params = []; }
            window.electronAPI.dbGet(sql, params)
                .then((row) => { if (callback) callback(null, row) })
                .catch((err) => { console.error('[DB IPC] get error:', err); if (callback) callback(err) })
            return handlers
        },
        all: (sql, params, callback) => {
            if (typeof params === 'function') { callback = params; params = []; }
            window.electronAPI.dbAll(sql, params)
                .then((rows) => { if (callback) callback(null, rows) })
                .catch((err) => { console.error('[DB IPC] all error:', err); if (callback) callback(err) })
            return handlers
        },
        each: (sql, params, callback) => {
            if (typeof params === 'function') { callback = params; params = []; }
            window.electronAPI.dbAll(sql, params)
                .then((rows) => {
                    if (callback) {
                        rows.forEach(row => callback(null, row))
                        callback(null, null)
                    }
                })
                .catch((err) => { console.error('[DB IPC] each error:', err); if (callback) callback(err) })
            return handlers
        },
        close: (callback) => { if (callback) callback() }
    }
    return handlers
}

db = createIPCProxy()

export default db