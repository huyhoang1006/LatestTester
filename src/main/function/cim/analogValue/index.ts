import db from '../../datacontext/index'
import * as measurementValueFunc from '../measurementValue/index'

export const getAnalogValueById = async (mrid: string) => {
  try {
    const measurementValue: any = await measurementValueFunc.getMeasurementValueById(mrid)
    if (!measurementValue.success) {
      return { success: false, data: null, message: 'MeasurementValue not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM analog_value WHERE mrid=?`, [mrid], (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get analogValue by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'AnalogValue not found' })
        return resolve({
          success: true,
          data: { ...measurementValue.data, ...row },
          message: 'Get analogValue by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get analogValue by id failed' }
  }
}

export const getAnalogValueByTestDataSetMrids = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({
        success: true,
        data: [],
        message: 'Get analogValue by testDataSet mrids completed'
      })
    }

    const placeholders = mrids.map(() => '?').join(',')

    const sql = `
            SELECT
                av.*,
                mv.*,
                io.*,
                iop.*,
                pdmv.procedure_dataset_id
            FROM procedure_dataset_measurement_value pdmv
            JOIN measurement_value mv
                ON mv.mrid = pdmv.measurement_value_id
            JOIN analog_value av
                ON av.mrid = mv.mrid
            LEFT JOIN iopoint iop
                ON iop.mrid = mv.mrid
            LEFT JOIN identified_object io
                ON io.mrid = mv.mrid
            WHERE pdmv.procedure_dataset_id IN (${placeholders})
        `

    db.all(sql, mrids, (err: Error | null, rows: unknown[]) => {
      if (err)
        return reject({
          success: false,
          err,
          message: 'Get analogValue by testDataSet mrids failed'
        })
      return resolve({
        success: true,
        data: rows,
        message: 'Get analogValue by testDataSet mrids completed'
      })
    })
  })
}

export const insertAnalogValueTransaction = async (analogValue: any, dbsql: typeof db) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvResult: any = await measurementValueFunc.insertMeasurementValueTransaction(
        analogValue,
        dbsql
      )
      if (!mvResult.success) {
        return reject({
          success: false,
          message: 'Insert measurementValue failed',
          err: mvResult.err
        })
      }
      dbsql.run(
        `INSERT INTO analog_value(
                    mrid, value, analog
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    value = excluded.value,
                    analog = excluded.analog
                `,
        [analogValue.mrid, analogValue.value, analogValue.analog],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert analogValue failed' })
          return resolve({
            success: true,
            data: analogValue,
            message: 'Insert analogValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert analogValue failed' })
    }
  })
}

export const updateAnalogValueByIdTransaction = async (
  mrid: string,
  analogValue: any,
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvResult: any = await measurementValueFunc.updateMeasurementValueByIdTransaction(
        mrid,
        analogValue,
        dbsql
      )
      if (!mvResult.success) {
        return reject({
          success: false,
          message: 'Update measurementValue failed',
          err: mvResult.err
        })
      }
      dbsql.run(
        `UPDATE analog_value SET
                    value = ?,
                    analog = ?
                WHERE mrid = ?`,
        [analogValue.value, analogValue.analog, mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update analogValue failed' })
          return resolve({
            success: true,
            data: analogValue,
            message: 'Update analogValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update analogValue failed' })
    }
  })
}

export const deleteAnalogValueByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM analog_value WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete analogValue failed' })
          if (this.changes === 0)
            return resolve({ success: false, data: null, message: 'AnalogValue not found' })
          measurementValueFunc.deleteMeasurementValueByIdTransaction(mrid, dbsql)
          return resolve({ success: true, data: null, message: 'Delete analogValue completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete analogValue failed' })
    }
  })
}
