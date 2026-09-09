'use strict'
const mockDb = {
  serialize: (callback) => callback(),
  run: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
    }
    if (callback) callback()
    return mockDb
  },
  get: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
    }
    if (callback) callback(null, null)
    return mockDb
  },
  all: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
    }
    if (callback) callback(null, [])
    return mockDb
  },
  each: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params
    }
    if (callback) callback(null, null)
    return mockDb
  },
  prepare: (sql) => {
    return {
      bind: () => mockDb,
      run: (params, callback) => {
        if (typeof params === 'function') {
          callback = params
        }
        if (callback) callback()
        return mockDb
      },
      get: (params, callback) => {
        if (typeof params === 'function') {
          callback = params
        }
        if (callback) callback(null, null)
        return mockDb
      },
      all: (params, callback) => {
        if (typeof params === 'function') {
          callback = params
        }
        if (callback) callback(null, [])
        return mockDb
      }
    }
  },
  close: (callback) => {
    if (callback) callback()
    return mockDb
  }
}

export default mockDb
