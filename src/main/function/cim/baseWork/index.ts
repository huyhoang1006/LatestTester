import db from '../../datacontext/index'
import * as documentFunc from '../document/index'

export const getBaseWorkById = async (mrid: string) => {
  try {
    const document: any = await documentFunc.getDocumentById(mrid)
    if (!document.success) {
      return { success: false, data: null, message: 'Document not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM base_work WHERE mrid=?`, [mrid], (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get baseWork by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'BaseWork not found' })
        return resolve({
          success: true,
          data: { ...document.data, ...row },
          message: 'Get baseWork by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get baseWork by id failed' }
  }
}

export const insertBaseWorkTransaction = async (
  baseWork: {
    mrid: string
    kind: string | null
    priority: string | null
    status_kind: string | null
    work_location: string | null
  },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docResult: any = await documentFunc.insertDocumentTransaction(baseWork, dbsql)
      if (!docResult.success) {
        return reject({ success: false, message: 'Insert document failed', err: docResult.err })
      }
      dbsql.run(
        `INSERT INTO base_work(
                    mrid, kind, priority, status_kind, work_location
                ) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    kind = excluded.kind,
                    priority = excluded.priority,
                    status_kind = excluded.status_kind,
                    work_location = excluded.work_location
                `,
        [
          baseWork.mrid,
          baseWork.kind,
          baseWork.priority,
          baseWork.status_kind,
          baseWork.work_location
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert baseWork failed' })
          return resolve({ success: true, data: baseWork, message: 'Insert baseWork completed' })
        }
      )
    } catch (err) {
      console.error('Insert baseWork failed:', err)
      return reject({ success: false, err, message: 'Insert baseWork failed' })
    }
  })
}

export const updateBaseWorkByIdTransaction = async (
  mrid: string,
  baseWork: {
    kind: string | null
    priority: string | null
    status_kind: string | null
    work_location: string | null
  },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docResult: any = await documentFunc.updateDocumentByIdTransaction(mrid, baseWork, dbsql)
      if (!docResult.success) {
        return reject({ success: false, message: 'Update document failed', err: docResult.err })
      }
      dbsql.run(
        `UPDATE base_work SET
                    kind = ?,
                    priority = ?,
                    status_kind = ?,
                    work_location = ?
                WHERE mrid = ?`,
        [baseWork.kind, baseWork.priority, baseWork.status_kind, baseWork.work_location, mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update baseWork failed' })
          return resolve({ success: true, data: baseWork, message: 'Update baseWork completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update baseWork failed' })
    }
  })
}

export const deleteBaseWorkByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM base_work WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete base_work failed' })
          if (this.changes === 0)
            return resolve({ success: false, data: null, message: 'Base_work not found' })
          documentFunc.deleteDocumentByIdTransaction(mrid, dbsql)
          return resolve({ success: true, data: null, message: 'Delete base_work completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete base_work failed' })
    }
  })
}
