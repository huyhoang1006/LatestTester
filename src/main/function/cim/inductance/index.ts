import db from '../../datacontext/index'

export const getInductanceById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM inductance WHERE mrid=?', [mrid], (err: any, row: any) => {
      if (err) return reject({ success: false, err: err, message: 'Get inductance by id failed' })
      if (!row) return resolve({ success: false, data: null, message: 'Inductance not found' })
      return resolve({ success: true, data: row, message: 'Get Inductances by id completed' })
    })
  })
}

export const getInductanceByIds = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({ success: false, data: [], message: 'No mrids provided' })
    }

    const placeholders = mrids.map(() => '?').join(',')

    db.all(
      `SELECT * FROM inductance WHERE mrid IN (${placeholders})`,
      mrids,
      (err: any, rows: any) => {
        if (err) {
          return reject({ success: false, err: err, message: 'Get Inductance by ids failed' })
        }
        if (!rows || rows.length === 0) {
          return resolve({ success: false, data: [], message: 'Inductance not found' })
        }
        return resolve({ success: true, data: rows, message: 'Get Inductance by ids completed' })
      }
    )
  })
}

export const insertInductance = async (inductance: any) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO inductance(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [inductance.mrid, inductance.multiplier, inductance.unit, inductance.value],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Insert inductance failed' })
        return resolve({ success: true, data: inductance, message: 'Insert inductance completed' })
      }
    )
  })
}

export const insertInductanceTransaction = async (inductance: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO inductance(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
      [inductance.mrid, inductance.multiplier, inductance.unit, inductance.value],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Insert inductance failed' })
        return resolve({ success: true, data: inductance, message: 'Insert inductance completed' })
      }
    )
  })
}

export const updateInductanceById = async (mrid: string, inductance: any) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE inductance
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [inductance.multiplier, inductance.unit, inductance.value, mrid],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Update inductance failed' })
        return resolve({ success: true, data: inductance, message: 'Update inductance completed' })
      }
    )
  })
}

export const updateInductanceByIdTransaction = async (
  mrid: string,
  inductance: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE inductance
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
      [inductance.multiplier, inductance.unit, inductance.value, mrid],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Update inductance failed' })
        return resolve({ success: true, data: inductance, message: 'Update inductance completed' })
      }
    )
  })
}

export const deleteInductanceById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM inductance WHERE mrid=?', [mrid], function (this: any, err: any) {
      if (err) return reject({ success: false, err, message: 'Delete inductance failed' })
      if (this.changes === 0)
        return resolve({ success: false, data: null, message: 'Inductance not found' })
      return resolve({ success: true, data: null, message: 'Delete inductance completed' })
    })
  })
}

export const deleteInductanceByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run('DELETE FROM inductance WHERE mrid=?', [mrid], function (this: any, err: any) {
      if (err) return reject({ success: false, err, message: 'Delete inductance failed' })
      if (this.changes === 0)
        return resolve({ success: false, data: null, message: 'Inductance not found' })
      return resolve({ success: true, data: null, message: 'Delete inductance completed' })
    })
  })
}
