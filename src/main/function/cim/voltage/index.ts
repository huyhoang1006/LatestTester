import db from '../../datacontext/index'

export const getVoltageById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM voltage WHERE mrid=?', [mrid], (err: Error | null, row: unknown) => {
      if (err) return reject({ success: false, err: err, message: 'Get voltage by id failed' })
      if (!row) return resolve({ success: false, data: null, message: 'Voltage not found' })
      return resolve({ success: true, data: row, message: 'Get voltage by id completed' })
    })
  })
}

export const getVoltageByIds = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({ success: false, data: [], message: 'No mrids provided' })
    }

    const placeholders = mrids.map(() => '?').join(',')

    db.all(
      `SELECT * FROM voltage WHERE mrid IN (${placeholders})`,
      mrids,
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject({ success: false, err: err, message: 'Get voltages by ids failed' })
        if (!rows || rows.length === 0)
          return resolve({ success: false, data: [], message: 'Voltages not found' })
        return resolve({ success: true, data: rows, message: 'Get voltages by ids completed' })
      }
    )
  })
}

export const insertVoltage = async (voltage: {
  mrid: string
  multiplier: string | null
  unit: string | null
  value: number | null
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO voltage(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [voltage.mrid, voltage.multiplier, voltage.unit, voltage.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert voltage failed' })
        return resolve({ success: true, data: voltage, message: 'Insert voltage completed' })
      }
    )
  })
}

export const insertVoltageTransaction = async (
  voltage: { mrid: string; multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO voltage(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [voltage.mrid, voltage.multiplier, voltage.unit, voltage.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert voltage failed' })
        return resolve({ success: true, data: voltage, message: 'Insert voltage completed' })
      }
    )
  })
}

export const updateVoltageById = async (
  mrid: string,
  voltage: { multiplier: string | null; unit: string | null; value: number | null }
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE voltage
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [voltage.multiplier, voltage.unit, voltage.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update voltage failed' })
        return resolve({ success: true, data: voltage, message: 'Update voltage completed' })
      }
    )
  })
}

export const updateVoltageByIdTransaction = async (
  mrid: string,
  voltage: { multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE voltage
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [voltage.multiplier, voltage.unit, voltage.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update voltage failed' })
        return resolve({ success: true, data: voltage, message: 'Update voltage completed' })
      }
    )
  })
}

export const deleteVoltageById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM voltage WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete voltage failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'Voltage not found' })
        return resolve({ success: true, data: null, message: 'Delete voltage completed' })
      }
    )
  })
}

export const deleteVoltageByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM voltage WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete voltage failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'Voltage not found' })
        return resolve({ success: true, data: null, message: 'Delete voltage completed' })
      }
    )
  })
}
