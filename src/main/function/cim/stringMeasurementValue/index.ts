import db from '../../datacontext/index'
import * as measurementValueFunc from '../measurementValue/index'

export const getStringMeasurementValueById = async (mrid: string) => {
  try {
    const measurementValue: any = await measurementValueFunc.getMeasurementValueById(mrid)
    if (!measurementValue.success) {
      return { success: false, data: null, message: 'MeasurementValue not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM string_measurement_value WHERE mrid=?`,
        [mrid],
        (err: any, row: any) => {
          if (err)
            return reject({
              success: false,
              err,
              message: 'Get stringMeasurementValue by id failed'
            })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'StringMeasurementValue not found'
            })
          return resolve({
            success: true,
            data: { ...measurementValue.data, ...row },
            message: 'Get stringMeasurementValue by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get stringMeasurementValue by id failed' }
  }
}

export const getStringMeasurementValueByTestDataSetMrids = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({
        success: true,
        data: [],
        message: 'Get stringMeasurementValue by testDataSet mrids completed'
      })
    }

    const placeholders = mrids.map(() => '?').join(',')

    const sql = `
            SELECT 
                smv.*, 
                mv.*, 
                io.*, 
                iop.*, 
                pdmv.procedure_dataset_id
            FROM procedure_dataset_measurement_value pdmv
            JOIN measurement_value mv 
                ON mv.mrid = pdmv.measurement_value_id
            JOIN string_measurement_value smv 
                ON smv.mrid = mv.mrid
            LEFT JOIN iopoint iop
                ON iop.mrid = mv.mrid
            LEFT JOIN identified_object io
                ON io.mrid = mv.mrid
            WHERE pdmv.procedure_dataset_id IN (${placeholders})
        `

    db.all(sql, mrids, (err: any, rows: any) => {
      if (err) {
        return reject({
          success: false,
          err,
          message: 'Get stringMeasurementValue by testDataSet mrids failed'
        })
      }

      return resolve({
        success: true,
        data: rows,
        message: 'Get stringMeasurementValue by testDataSet mrids completed'
      })
    })
  })
}

export const insertStringMeasurementValueTransaction = async (
  stringMeasurementValue: any,
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvResult: any = await measurementValueFunc.insertMeasurementValueTransaction(
        stringMeasurementValue,
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
        `INSERT INTO string_measurement_value(
                    mrid, value, string_measurement
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    value = excluded.value,
                    string_measurement = excluded.string_measurement
                `,
        [
          stringMeasurementValue.mrid,
          stringMeasurementValue.value,
          stringMeasurementValue.string_measurement
        ],
        function (err: any) {
          if (err)
            return reject({ success: false, err, message: 'Insert stringMeasurementValue failed' })
          return resolve({
            success: true,
            data: stringMeasurementValue,
            message: 'Insert stringMeasurementValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert stringMeasurementValue failed' })
    }
  })
}

export const updateStringMeasurementValueByIdTransaction = async (
  mrid: string,
  stringMeasurementValue: any,
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvResult: any = await measurementValueFunc.updateMeasurementValueByIdTransaction(
        mrid,
        stringMeasurementValue,
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
        `UPDATE string_measurement_value SET
                    value = ?,
                    string_measurement = ?
                WHERE mrid = ?`,
        [stringMeasurementValue.value, stringMeasurementValue.string_measurement, mrid],
        function (err: any) {
          if (err)
            return reject({ success: false, err, message: 'Update stringMeasurementValue failed' })
          return resolve({
            success: true,
            data: stringMeasurementValue,
            message: 'Update stringMeasurementValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update stringMeasurementValue failed' })
    }
  })
}

export const deleteStringMeasurementValueByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM string_measurement_value WHERE mrid=?',
        [mrid],
        function (this: any, err: any) {
          if (err)
            return reject({ success: false, err, message: 'Delete stringMeasurementValue failed' })
          if (this.changes === 0)
            return resolve({
              success: false,
              data: null,
              message: 'StringMeasurementValue not found'
            })
          measurementValueFunc.deleteMeasurementValueByIdTransaction(mrid, dbsql)
          return resolve({
            success: true,
            data: null,
            message: 'Delete stringMeasurementValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete stringMeasurementValue failed' })
    }
  })
}
