import db from '../../datacontext/index'
import * as measurementValueSourceFunc from '../measurementValueSource/index'

export const getIOPointSourceById = async (mrid: string) => {
  try {
    const measurementValueSource: any =
      await measurementValueSourceFunc.getMeasurementValueSourceById(mrid)
    if (!measurementValueSource.success) {
      return { success: false, data: null, message: 'MeasurementValueSource not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM iopoint_source WHERE mrid=?`, [mrid], (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get iopointSource by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'IOPointSource not found' })
        return resolve({
          success: true,
          data: { ...measurementValueSource.data, ...row },
          message: 'Get iopointSource by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get iopointSource by id failed' }
  }
}

export const insertIOPointSourceTransaction = async (
  iopointSource: { mrid: string },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvsResult: any =
        await measurementValueSourceFunc.insertMeasurementValueSourceTransaction(
          iopointSource,
          dbsql
        )
      if (!mvsResult.success) {
        return reject({
          success: false,
          message: 'Insert measurementValueSource failed',
          err: mvsResult.err
        })
      }
      dbsql.run(
        `INSERT INTO iopoint_source(
                    mrid
                ) VALUES (?)
                ON CONFLICT(mrid) DO UPDATE SET
                    mrid = excluded.mrid
                `,
        [iopointSource.mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert iopointSource failed' })
          return resolve({
            success: true,
            data: iopointSource,
            message: 'Insert iopointSource completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert iopointSource failed' })
    }
  })
}

export const updateIOPointSourceByIdTransaction = async (
  mrid: string,
  iopointSource: { mrid: string },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mvsResult: any =
        await measurementValueSourceFunc.updateMeasurementValueSourceByIdTransaction(
          mrid,
          iopointSource,
          dbsql
        )
      if (!mvsResult.success) {
        return reject({
          success: false,
          message: 'Update measurementValueSource failed',
          err: mvsResult.err
        })
      }
      dbsql.run(
        `UPDATE iopoint_source SET
                    mrid = ?
                WHERE mrid = ?`,
        [iopointSource.mrid, mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update iopointSource failed' })
          return resolve({
            success: true,
            data: iopointSource,
            message: 'Update iopointSource completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update iopointSource failed' })
    }
  })
}

export const deleteIOPointSourceByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM iopoint_source WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete iopointSource failed' })
          if (this.changes === 0)
            return resolve({ success: false, data: null, message: 'IOPointSource not found' })
          measurementValueSourceFunc.deleteMeasurementValueSourceByIdTransaction(mrid, dbsql)
          return resolve({ success: true, data: null, message: 'Delete iopointSource completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete iopointSource failed' })
    }
  })
}
