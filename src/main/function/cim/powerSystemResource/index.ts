import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const insertPowerSystemResource = async (psr: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      identifiedObjectFunc
        .insertIdentifiedObjectTransaction(psr, db)
        .then((identifiedResult: any) => {
          if (!identifiedResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert identified object failed',
              err: identifiedResult.err
            })
          }
          db.run(
            `INSERT INTO power_system_resource(
                            mrid,
                            psr_type_id,
                            location
                        ) VALUES (?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            psr_type_id = excluded.psr_type_id,
                            location = excluded.location`,
            [psr.mrid, psr.psr_type_id, psr.location],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert powerSystemResource failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: psr,
                message: 'Insert powerSystemResource completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Insert powerSystemResource transaction failed'
          })
        })
    })
  })
}

export const insertPowerSystemResourceTransaction = async (psr: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .insertIdentifiedObjectTransaction(psr, dbsql)
      .then((identifiedResult: any) => {
        if (!identifiedResult.success) {
          return reject({
            success: false,
            message: 'Insert identified object failed',
            err: identifiedResult.err
          })
        }
        dbsql.run(
          `INSERT INTO power_system_resource(
                        mrid,
                        psr_type_id,
                        location
                    ) VALUES (?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        psr_type_id = excluded.psr_type_id,
                        location = excluded.location`,
          [psr.mrid, psr.psr_type_id, psr.location],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Insert powerSystemResource failed' })
            }
            return resolve({
              success: true,
              data: psr,
              message: 'Insert powerSystemResource completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Insert powerSystemResource transaction failed'
        })
      })
  })
}

export const getPowerSystemResourceById = async (mrid: string) => {
  try {
    const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
    if (!identifiedResult.success) {
      return { success: false, data: null, message: 'Identified object not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM power_system_resource WHERE mrid = ?', [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get powerSystemResource failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'PowerSystemResource not found' })
        const data = { ...identifiedResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get powerSystemResource completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get powerSystemResource failed' }
  }
}

export const updatePowerSystemResourceById = async (mrid: string, psr: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      identifiedObjectFunc
        .updateIdentifiedObjectByIdTransaction(mrid, psr, db)
        .then((identifiedResult: any) => {
          if (!identifiedResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update identified object failed',
              err: identifiedResult.err
            })
          }
          db.run(
            `UPDATE power_system_resource SET
                            psr_type_id = ?,
                            location = ?
                        WHERE mrid = ?`,
            [psr.psr_type_id, psr.location, mrid],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update powerSystemResource failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: psr,
                message: 'Update powerSystemResource completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Update powerSystemResource transaction failed'
          })
        })
    })
  })
}

export const updatePowerSystemResourceTransaction = async (mrid: string, psr: any, dbsql: any) => {
  return updatePowerSystemResourceByIdTransaction(mrid, psr, dbsql)
}

export const updatePowerSystemResourceByIdTransaction = async (
  mrid: string,
  psr: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .updateIdentifiedObjectByIdTransaction(mrid, psr, dbsql)
      .then((identifiedResult: any) => {
        if (!identifiedResult.success) {
          return reject({
            success: false,
            message: 'Update identified object failed',
            err: identifiedResult.err
          })
        }
        dbsql.run(
          `UPDATE power_system_resource SET
                        psr_type_id = ?,
                        location = ?
                    WHERE mrid = ?`,
          [psr.psr_type_id, psr.location, mrid],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Update powerSystemResource failed' })
            }
            return resolve({
              success: true,
              data: psr,
              message: 'Update powerSystemResource completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Update powerSystemResource transaction failed'
        })
      })
  })
}

export const deletePowerSystemResourceById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .deleteIdentifiedObjectByIdTransaction(mrid, db)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete identified object failed',
            err: result.err
          })
        }
        return resolve({
          success: true,
          message: 'Delete powerSystemResource (and identified object) completed'
        })
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Delete powerSystemResource transaction failed'
        })
      })
  })
}

export const deletePowerSystemResourceByIdTransaction = async (mrid: string, dbsql: any) => {
  return identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
}

export const getPowerSystemResourceByLocationIdTransaction = async (
  locationId: string,
  dbsql: any
) => {
  try {
    return new Promise((resolve, reject) => {
      dbsql.all(
        'SELECT * FROM power_system_resource WHERE location = ?',
        [locationId],
        (err: any, rows: any) => {
          if (err) return reject({ success: false, err, message: 'Get powerSystemResource failed' })
          if (!rows || rows.length === 0)
            return resolve({ success: false, data: null, message: 'PowerSystemResource not found' })
          const data = rows.map((row: any) => ({ ...row }))
          return resolve({
            success: true,
            data: data,
            message: 'Get powerSystemResource completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get powerSystemResource failed' }
  }
}

export const getLocationByPowerSystemResourceId = async (psrId: string) => {
  try {
    return new Promise((resolve, reject) => {
      const sql = `
                SELECT l.*
                FROM power_system_resource psr
                JOIN location l ON psr.location = l.mrid
                WHERE psr.mrid = ?
            `

      db.get(sql, [psrId], (err: any, row: any) => {
        if (err) {
          return reject({ success: false, err, message: 'Get location failed' })
        }
        if (!row) {
          return resolve({ success: false, data: null, message: 'Location not found' })
        }
        return resolve({ success: true, data: row, message: 'Get location completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get location failed' }
  }
}
