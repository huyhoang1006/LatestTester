import db from '../../datacontext/index'
import * as documentFunc from '../document/index'

export const getProcedureDataSetById = async (mrid: string) => {
  try {
    const document: any = await documentFunc.getDocumentById(mrid)
    if (!document.success) {
      return { success: false, data: null, message: 'Document not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM procedure_dataset WHERE mrid=?`,
        [mrid],
        (err: Error | null, row: any) => {
          if (err)
            return reject({ success: false, err, message: 'Get procedureDataSet by id failed' })
          if (!row)
            return resolve({ success: false, data: null, message: 'ProcedureDataSet not found' })
          return resolve({
            success: true,
            data: { ...document.data, ...row },
            message: 'Get procedureDataSet by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get procedureDataSet by id failed' }
  }
}

export const insertProcedureDataSetTransaction = async (
  procedureDataSet: {
    mrid: string
    completed_date_time: string | null
    work_task: string | null
    asset: string | null
    procedure: string | null
  },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docResult: any = await documentFunc.insertDocumentTransaction(procedureDataSet, dbsql)
      if (!docResult.success) {
        return reject({ success: false, message: 'Insert document failed', err: docResult.err })
      }
      dbsql.run(
        `INSERT INTO procedure_dataset(
                    mrid, completed_date_time, work_task, asset, procedure
                ) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    completed_date_time = excluded.completed_date_time,
                    work_task = excluded.work_task,
                    asset = excluded.asset,
                    procedure = excluded.procedure
                `,
        [
          procedureDataSet.mrid,
          procedureDataSet.completed_date_time,
          procedureDataSet.work_task,
          procedureDataSet.asset,
          procedureDataSet.procedure
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert procedureDataSet failed' })
          return resolve({
            success: true,
            data: procedureDataSet,
            message: 'Insert procedureDataSet completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert procedureDataSet failed' })
    }
  })
}

export const updateProcedureDataSetByIdTransaction = async (
  mrid: string,
  procedureDataSet: {
    completed_date_time: string | null
    work_task: string | null
    asset: string | null
    procedure: string | null
  },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docResult: any = await documentFunc.updateDocumentByIdTransaction(
        mrid,
        procedureDataSet,
        dbsql
      )
      if (!docResult.success) {
        return reject({ success: false, message: 'Update document failed', err: docResult.err })
      }
      dbsql.run(
        `UPDATE procedure_dataset SET
                    completed_date_time = ?,
                    work_task = ?,
                    asset = ?,
                    procedure = ?
                WHERE mrid = ?`,
        [
          procedureDataSet.completed_date_time,
          procedureDataSet.work_task,
          procedureDataSet.asset,
          procedureDataSet.procedure,
          mrid
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update procedureDataSet failed' })
          return resolve({
            success: true,
            data: procedureDataSet,
            message: 'Update procedureDataSet completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update procedureDataSet failed' })
    }
  })
}

export const deleteProcedureDataSetByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM procedure_dataset WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete procedureDataSet failed' })
          if (this.changes === 0)
            return resolve({ success: false, data: null, message: 'ProcedureDataSet not found' })
          documentFunc.deleteDocumentByIdTransaction(mrid, dbsql)
          return resolve({
            success: true,
            data: null,
            message: 'Delete procedureDataSet completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete procedureDataSet failed' })
    }
  })
}
