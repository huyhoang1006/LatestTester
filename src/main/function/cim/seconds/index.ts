import db from '../../datacontext/index'

export const getSecondById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM seconds WHERE mrid=?', [mrid], (err: Error | null, row: unknown) => {
      if (err) return reject({ success: false, err: err, message: 'Get seconds by id failed' })
      if (!row) return resolve({ success: false, data: null, message: 'Seconds not found' })
      return resolve({ success: true, data: row, message: 'Get seconds by id completed' })
    })
  })
}

export const getSecondByIds = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({ success: false, data: [], message: 'No mrids provided' })
    }

    const placeholders = mrids.map(() => '?').join(',')

    db.all(
      `SELECT * FROM seconds WHERE mrid IN (${placeholders})`,
      mrids,
      (err: Error | null, rows: unknown[]) => {
        if (err) {
          return reject({ success: false, err: err, message: 'Get seconds by ids failed' })
        }
        if (!rows || rows.length === 0) {
          return resolve({ success: false, data: [], message: 'Seconds not found' })
        }
        return resolve({ success: true, data: rows, message: 'Get seconds by ids completed' })
      }
    )
  })
}

export const insertSeconds = async (seconds: {
  mrid: string
  multiplier: string | null
  unit: string | null
  value: number | null
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO seconds(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [seconds.mrid, seconds.multiplier, seconds.unit, seconds.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert seconds failed' })
        return resolve({ success: true, data: seconds, message: 'Insert seconds completed' })
      }
    )
  })
}

export const insertSecondsTransaction = async (
  seconds: { mrid: string; multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO seconds(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [seconds.mrid, seconds.multiplier, seconds.unit, seconds.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert seconds failed' })
        return resolve({ success: true, data: seconds, message: 'Insert seconds completed' })
      }
    )
  })
}

export const updateSecondsById = async (
  mrid: string,
  seconds: { multiplier: string | null; unit: string | null; value: number | null }
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE seconds
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [seconds.multiplier, seconds.unit, seconds.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update seconds failed' })
        return resolve({ success: true, data: seconds, message: 'Update seconds completed' })
      }
    )
  })
}

export const updateSecondsByIdTransaction = async (
  mrid: string,
  seconds: { multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE seconds
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [seconds.multiplier, seconds.unit, seconds.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update seconds failed' })
        return resolve({ success: true, data: seconds, message: 'Update seconds completed' })
      }
    )
  })
}

export const deleteSecondsById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM seconds WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete seconds failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'Seconds not found' })
        return resolve({ success: true, data: null, message: 'Delete seconds completed' })
      }
    )
  })
}

export const deleteSecondsByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM seconds WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete seconds failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'Seconds not found' })
        return resolve({ success: true, data: null, message: 'Delete seconds completed' })
      }
    )
  })
}
