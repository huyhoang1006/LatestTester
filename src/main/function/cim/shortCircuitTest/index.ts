import db from '../../datacontext/index.js'
import * as transformerTestFunc from '../transformerTest/index.js'

export const insertShortCircuitTestTransaction = async (sct: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    transformerTestFunc
      .insertTransformerTestTransaction(sct, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Insert transformer test failed',
            err: result.err
          })
        }

        dbsql.run(
          `INSERT INTO short_circuit_test (
                        mrid,
                        current,
                        energised_end_step,
                        grounded_end_step,
                        leakage_impedance,
                        leakage_impedance_zero,
                        loss,
                        loss_zero,
                        power,
                        voltage,
                        energised_end
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        current = excluded.current,
                        energised_end_step = excluded.energised_end_step,
                        grounded_end_step = excluded.grounded_end_step,
                        leakage_impedance = excluded.leakage_impedance,
                        leakage_impedance_zero = excluded.leakage_impedance_zero,
                        loss = excluded.loss,
                        loss_zero = excluded.loss_zero,
                        power = excluded.power,
                        voltage = excluded.voltage,
                        energised_end = excluded.energised_end`,
          [
            sct.mrid,
            sct.current,
            sct.energised_end_step,
            sct.grounded_end_step,
            sct.leakage_impedance,
            sct.leakage_impedance_zero,
            sct.loss,
            sct.loss_zero,
            sct.power,
            sct.voltage,
            sct.energised_end
          ],
          function (err: any) {
            if (err) {
              return reject({
                success: false,
                err,
                message: 'Insert ShortCircuitTest failed'
              })
            }

            return resolve({
              success: true,
              data: sct,
              message: 'Insert ShortCircuitTest completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Insert ShortCircuitTest transaction failed'
        })
      })
  })
}

export const updateShortCircuitTestByIdTransaction = async (mrid: string, sct: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    transformerTestFunc
      .updateTransformerTestByIdTransaction(mrid, sct, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Update transformer test failed',
            err: result.err
          })
        }

        dbsql.run(
          `UPDATE short_circuit_test SET
                        current = ?,
                        energised_end_step = ?,
                        grounded_end_step = ?,
                        leakage_impedance = ?,
                        leakage_impedance_zero = ?,
                        loss = ?,
                        loss_zero = ?,
                        power = ?,
                        voltage = ?,
                        energised_end = ?
                    WHERE mrid = ?`,
          [
            sct.current,
            sct.energised_end_step,
            sct.grounded_end_step,
            sct.leakage_impedance,
            sct.leakage_impedance_zero,
            sct.loss,
            sct.loss_zero,
            sct.power,
            sct.voltage,
            sct.energised_end,
            mrid
          ],
          function (err: any) {
            if (err) {
              return reject({
                success: false,
                err,
                message: 'Update ShortCircuitTest failed'
              })
            }

            return resolve({
              success: true,
              data: sct,
              message: 'Update ShortCircuitTest completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Update ShortCircuitTest transaction failed'
        })
      })
  })
}

export const deleteShortCircuitTestByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(`DELETE FROM short_circuit_test WHERE mrid = ?`, [mrid], function (err: any) {
      if (err) {
        return reject({
          success: false,
          err,
          message: 'Delete ShortCircuitTest failed'
        })
      }
      transformerTestFunc
        .deleteTransformerTestByIdTransaction(mrid, dbsql)
        .then((result: any) => resolve(result))
        .catch((err: any) =>
          reject({
            success: false,
            err,
            message: 'Delete TransformerTest failed after ShortCircuitTest delete'
          })
        )
    })
  })
}

export const getShortCircuitTestById = async (mrid: string) => {
  try {
    const transformerResult: any = await transformerTestFunc.getTransformerTestById(mrid)
    if (!transformerResult.success) {
      return { success: false, data: null, message: 'TransformerTest not found' }
    }

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM short_circuit_test WHERE mrid = ?`, [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get ShortCircuitTest failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'ShortCircuitTest not found' })

        const data = { ...transformerResult.data, ...row }
        return resolve({ success: true, data, message: 'Get ShortCircuitTest completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get ShortCircuitTest failed' }
  }
}

export const getShortCircuitTestByTransformerEndInfoId = async (energisedEnd: string) => {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT 
                io.*, 
                tt.*, 
                sct.*
            FROM short_circuit_test sct
            JOIN transformer_test tt ON sct.mrid = tt.mrid
            JOIN identified_object io ON tt.mrid = io.mrid
            WHERE sct.energised_end = ?
        `

    db.all(sql, [energisedEnd], (err: any, rows: any) => {
      if (err) {
        return reject({ success: false, err, message: 'Query ShortCircuitTest failed' })
      }

      if (!rows) {
        return resolve({ success: false, data: null, message: 'ShortCircuitTest not found' })
      }

      if (rows.length === 0) {
        return resolve({ success: false, data: null, message: 'ShortCircuitTest not found' })
      }

      return resolve({
        success: true,
        data: rows,
        message: 'Get ShortCircuitTest by energised_end_step completed'
      })
    })
  })
}
