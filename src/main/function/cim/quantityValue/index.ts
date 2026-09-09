import db from '../../datacontext/index'

export const getQuantityValueById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM quantity_value WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err) return reject({ success: false, err, message: 'Get QuantityValue by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'QuantityValue not found' })
        return resolve({ success: true, data: row, message: 'Get QuantityValue by id completed' })
      }
    )
  })
}

export const getQuantityValueByIds = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({ success: false, data: [], message: 'No mrids provided' })
    }

    const placeholders = mrids.map(() => '?').join(',')

    db.all(
      `SELECT * FROM quantity_value WHERE mrid IN (${placeholders})`,
      mrids,
      (err: Error | null, rows: unknown[]) => {
        if (err) {
          return reject({ success: false, err: err, message: 'Get quantity value by ids failed' })
        }
        if (!rows || rows.length === 0) {
          return resolve({ success: false, data: [], message: 'Quantity value not found' })
        }
        return resolve({
          success: true,
          data: rows,
          message: 'Get quantity value by ids completed'
        })
      }
    )
  })
}

export const insertQuantityValueTransaction = async (
  info: { mrid: string; multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO quantity_value(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value
            `,
      [info.mrid, info.multiplier, info.unit, info.value],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert QuantityValue failed' })
        return resolve({ success: true, data: info, message: 'Insert QuantityValue completed' })
      }
    )
  })
}

export const updateQuantityValueTransaction = async (
  mrid: string,
  info: { multiplier: string | null; unit: string | null; value: number | null },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE quantity_value SET
                multiplier = ?,
                unit = ?,
                value = ?
            WHERE mrid = ?`,
      [info.multiplier, info.unit, info.value, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update QuantityValue failed' })
        return resolve({ success: true, data: info, message: 'Update QuantityValue completed' })
      }
    )
  })
}

export const deleteQuantityValueTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `DELETE FROM quantity_value WHERE mrid = ?`,
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete QuantityValue failed' })
        return resolve({ success: true, data: mrid, message: 'Delete QuantityValue completed' })
      }
    )
  })
}
