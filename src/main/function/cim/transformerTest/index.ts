import db from '../../datacontext/index.js'
import * as identifiedObjectFunc from '../identifiedObject/index.js'

export const insertTransformerTestTransaction = async (tt: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .insertIdentifiedObjectTransaction(tt, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Insert identified object failed',
            err: result.err
          })
        }

        dbsql.run(
          `INSERT INTO transformer_test (
                        mrid,
                        base_power,
                        base_voltage,
                        temperature
                    ) VALUES (?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        base_power = excluded.base_power,
                        base_voltage = excluded.base_voltage,
                        temperature = excluded.temperature`,
          [tt.mrid, tt.base_power, tt.base_voltage, tt.temperature],
          function (err: any) {
            if (err) {
              return reject({
                success: false,
                err,
                message: 'Insert TransformerTest failed'
              })
            }

            return resolve({
              success: true,
              data: tt,
              message: 'Insert TransformerTest completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Insert TransformerTest transaction failed'
        })
      })
  })
}

export const updateTransformerTestByIdTransaction = async (mrid: string, tt: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .updateIdentifiedObjectByIdTransaction(mrid, tt, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Update identified object failed',
            err: result.err
          })
        }

        dbsql.run(
          `UPDATE transformer_test SET
                        base_power = ?,
                        base_voltage = ?,
                        temperature = ?
                    WHERE mrid = ?`,
          [tt.base_power, tt.base_voltage, tt.temperature, mrid],
          function (err: any) {
            if (err) {
              return reject({
                success: false,
                err,
                message: 'Update TransformerTest failed'
              })
            }

            return resolve({
              success: true,
              data: tt,
              message: 'Update TransformerTest completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Update TransformerTest transaction failed'
        })
      })
  })
}

export const deleteTransformerTestByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(`DELETE FROM transformer_test WHERE mrid = ?`, [mrid], function (err: any) {
      if (err) {
        return reject({
          success: false,
          err,
          message: 'Delete TransformerTest failed'
        })
      }

      identifiedObjectFunc
        .deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
        .then((result: any) => resolve(result))
        .catch((err: any) =>
          reject({
            success: false,
            err,
            message: 'Delete IdentifiedObject failed after TransformerTest delete'
          })
        )
    })
  })
}

export const getTransformerTestById = async (mrid: string) => {
  try {
    const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
    if (!identifiedResult.success) {
      return { success: false, data: null, message: 'Identified object not found' }
    }

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM transformer_test WHERE mrid = ?`, [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get TransformerTest failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'TransformerTest not found' })

        const data = { ...identifiedResult.data, ...row }
        return resolve({ success: true, data, message: 'Get TransformerTest completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get TransformerTest failed' }
  }
}
