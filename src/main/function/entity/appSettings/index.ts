import db from '../../datacontext/index'

export const getAppSettingsByKey = async (key: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM app_settings WHERE key=?', [key], (err: Error | null, row: unknown) => {
      if (err) return reject({ success: false, err: err, message: 'Get appSettings by key failed' })
      if (!row) return resolve({ success: false, data: null, message: 'AppSettings not found' })
      return resolve({ success: true, data: row, message: 'Get appSettings by key completed' })
    })
  })
}

export const insertAppSettingsTransaction = (
  data: { key: string; value: unknown },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO app_settings(
                key, value
            ) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET
                value = excluded.value
            `,
      [data.key, data.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err: err,
            message: 'Insert appSettings transaction failed'
          })
        }
        return resolve({
          success: true,
          data: data,
          message: 'Insert appSettings transaction completed'
        })
      }
    )
  })
}

export const updateAppSettingsTransaction = (
  data: { key: string; value: unknown },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE app_settings SET
                value = ?
            WHERE key = ?`,
      [data.value, data.key],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err: err,
            message: 'Update appSettings transaction failed'
          })
        }
        return resolve({
          success: true,
          data: data,
          message: 'Update appSettings transaction completed'
        })
      }
    )
  })
}

export const deleteAppSettingsPsrTransaction = (key: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM app_settings WHERE key=?',
      [key],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err: err,
            message: 'Delete appSettings transaction failed'
          })
        }
        return resolve({
          success: true,
          data: key,
          message: 'Delete appSettings transaction completed'
        })
      }
    )
  })
}
