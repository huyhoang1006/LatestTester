import db from '../../datacontext/index'

export const getApparentPowerById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM apparent_power WHERE mrid=?',
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({ success: false, err: err, message: 'Get apparent power by id failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'Apparent power not found' })
        return resolve({ success: true, data: row, message: 'Get apparent power by id completed' })
      }
    )
  })
}

export const getApparentPowerByIds = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({ success: false, data: [], message: 'No mrids provided' })
    }

    const placeholders = mrids.map(() => '?').join(',')

    db.all(
      `SELECT * FROM apparent_power WHERE mrid IN (${placeholders})`,
      mrids,
      (err: Error | null, rows: unknown[]) => {
        if (err) {
          return reject({ success: false, err: err, message: 'Get apparent power by ids failed' })
        }
        if (!rows || rows.length === 0) {
          return resolve({ success: false, data: [], message: 'Apparent power not found' })
        }
        return resolve({
          success: true,
          data: rows,
          message: 'Get apparent power by ids completed'
        })
      }
    )
  })
}

export const insertApparentPower = async (apparentPower: {
  mrid: string
  multiplier: string | null
  unit: string | null
  value: number | null
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO apparent_power(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [apparentPower.mrid, apparentPower.multiplier, apparentPower.unit, apparentPower.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert apparent power failed' })
        return resolve({
          success: true,
          data: apparentPower,
          message: 'Insert apparent power completed'
        })
      }
    )
  })
}

export const insertApparentPowerTransaction = async (
  apparentPower: {
    mrid: string
    multiplier: string | null
    unit: string | null
    value: number | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO apparent_power(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [apparentPower.mrid, apparentPower.multiplier, apparentPower.unit, apparentPower.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert apparent power failed' })
        return resolve({
          success: true,
          data: apparentPower,
          message: 'Insert apparent power completed'
        })
      }
    )
  })
}

export const updateApparentPowerById = async (
  mrid: string,
  apparentPower: { multiplier: string | null; unit: string | null; value: number | null }
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE apparent_power
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [apparentPower.multiplier, apparentPower.unit, apparentPower.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update apparent power failed' })
        return resolve({
          success: true,
          data: apparentPower,
          message: 'Update apparent power completed'
        })
      }
    )
  })
}

export const updateApparentPowerByIdTransaction = async (
  mrid: string,
  apparentPower: { multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE apparent_power
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [apparentPower.multiplier, apparentPower.unit, apparentPower.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update apparent power failed' })
        return resolve({
          success: true,
          data: apparentPower,
          message: 'Update apparent power completed'
        })
      }
    )
  })
}

export const deleteApparentPowerById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM apparent_power WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete apparent power failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'Apparent power not found' })
        return resolve({ success: true, data: null, message: 'Delete apparent power completed' })
      }
    )
  })
}

export const deleteApparentPowerByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM apparent_power WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete apparent power failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'Apparent power not found' })
        return resolve({ success: true, data: null, message: 'Delete apparent power completed' })
      }
    )
  })
}
