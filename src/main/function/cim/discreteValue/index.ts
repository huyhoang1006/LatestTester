import db from '../../datacontext/index'
import * as measurementValueFunc from '../measurementValue/index'

export const getDiscreteValueById = async (mrid: string) => {
  try {
    const measurementValue: any = await measurementValueFunc.getMeasurementValueById(mrid)
    if (!measurementValue.success) {
      return { success: false, data: null, message: 'MeasurementValue not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM discrete_value WHERE mrid=?`, [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get discreteValue by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'DiscreteValue not found' })
        return resolve({
          success: true,
          data: { ...measurementValue.data, ...row },
          message: 'Get discreteValue by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get discreteValue by id failed' }
  }
}

export const getDiscreteValueByTestDataSetMrids = async (mrids: string[]) => {
  return new Promise((resolve, reject) => {
    if (!mrids || mrids.length === 0) {
      return resolve({
        success: true,
        data: [],
        message: 'Get discreteValue by testDataSet mrids completed'
      })
    }

    const placeholders = mrids.map(() => '?').join(',')

    const sql = `
            SELECT 
                dv.*, 
                mv.*, 
                io.*,                 -- identified_object của measurement_value
                iop.*, 
                pdmv.procedure_dataset_id,

                io_vta.alias_name AS vta_alias_name   -- alias_name của value_to_alias

            FROM procedure_dataset_measurement_value pdmv

            JOIN measurement_value mv 
                ON mv.mrid = pdmv.measurement_value_id

            JOIN discrete_value dv 
                ON dv.mrid = mv.mrid

            LEFT JOIN discrete d
                ON d.mrid = dv.discrete

            LEFT JOIN value_to_alias vta
                ON vta.value_alias_set = d.value_alias_set
               AND vta.value = dv.value

            LEFT JOIN identified_object io_vta
                ON io_vta.mrid = vta.mrid

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
          message: 'Get discreteValue by testDataSet mrids failed'
        })
      }

      return resolve({
        success: true,
        data: rows,
        message: 'Get discreteValue by testDataSet mrids completed'
      })
    })
  })
}

export const insertDiscreteValueTransaction = async (discreteValue: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvResult: any = await measurementValueFunc.insertMeasurementValueTransaction(
        discreteValue,
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
        `INSERT INTO discrete_value(
                    mrid, value, discrete
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    value = excluded.value,
                    discrete = excluded.discrete
                `,
        [discreteValue.mrid, discreteValue.value, discreteValue.discrete],
        function (err: any) {
          if (err) return reject({ success: false, err, message: 'Insert discreteValue failed' })
          return resolve({
            success: true,
            data: discreteValue,
            message: 'Insert discreteValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert discreteValue failed' })
    }
  })
}

export const updateDiscreteValueByIdTransaction = async (
  mrid: string,
  discreteValue: any,
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvResult: any = await measurementValueFunc.updateMeasurementValueByIdTransaction(
        mrid,
        discreteValue,
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
        `UPDATE discrete_value SET
                    value = ?,
                    discrete = ?
                WHERE mrid = ?`,
        [discreteValue.value, discreteValue.discrete, mrid],
        function (err: any) {
          if (err) return reject({ success: false, err, message: 'Update discreteValue failed' })
          return resolve({
            success: true,
            data: discreteValue,
            message: 'Update discreteValue completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update discreteValue failed' })
    }
  })
}

export const deleteDiscreteValueByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run('DELETE FROM discrete_value WHERE mrid=?', [mrid], function (this: any, err: any) {
        if (err) return reject({ success: false, err, message: 'Delete discreteValue failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'DiscreteValue not found' })
        measurementValueFunc.deleteMeasurementValueByIdTransaction(mrid, dbsql)
        return resolve({ success: true, data: null, message: 'Delete discreteValue completed' })
      })
    } catch (err) {
      return reject({ success: false, err, message: 'Delete discreteValue failed' })
    }
  })
}
