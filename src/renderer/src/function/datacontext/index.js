'use strict'

const db = {
  serialize: (callback) => callback(),

  run: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
      params = []
    }
    const err = new Error(
      `[DATACONTEXT SECURITY] Raw SQL execution blocked. Use specific preload methods instead of db.run(sql, params). SQL: ${sql.substring(0, 120)}`
    )
    console.error(err.message)
    if (callback) callback(err)
    return db
  },

  get: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
      params = []
    }
    const err = new Error(
      `[DATACONTEXT SECURITY] Raw SQL execution blocked. Use specific preload methods instead of db.get(sql, params). SQL: ${sql.substring(0, 120)}`
    )
    console.error(err.message)
    if (callback) callback(err, null)
    return db
  },

  all: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
      params = []
    }
    const err = new Error(
      `[DATACONTEXT SECURITY] Raw SQL execution blocked. Use specific preload methods instead of db.all(sql, params). SQL: ${sql.substring(0, 120)}`
    )
    console.error(err.message)
    if (callback) callback(err, null)
    return db
  },

  each: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
      params = []
    }
    const err = new Error(
      `[DATACONTEXT SECURITY] Raw SQL execution blocked. Use specific preload methods instead of db.each(sql, params). SQL: ${sql.substring(0, 120)}`
    )
    console.error(err.message)
    if (callback) callback(err, null)
    return db
  },

  close: (callback) => {
    if (callback) callback()
  }
}

export default db
