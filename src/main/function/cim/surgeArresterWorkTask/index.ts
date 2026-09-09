import db from '../../datacontext/index'
import * as workTaskFunc from '../workTask/index'

export const getSurgeArresterWorkTaskById = async (mrid: string) => {
  try {
    const workTask: any = await workTaskFunc.getWorkTaskById(mrid)
    if (!workTask.success) {
      return { success: false, data: null, message: 'WorkTask not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM surge_arrester_work_task WHERE mrid=?`,
        [mrid],
        (err: Error | null, row: any) => {
          if (err)
            return reject({
              success: false,
              err,
              message: 'Get surgeArresterWorkTask by id failed'
            })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'SurgeArresterWorkTask not found'
            })
          return resolve({
            success: true,
            data: { ...workTask.data, ...row },
            message: 'Get surgeArresterWorkTask by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get surgeArresterWorkTask by id failed' }
  }
}

export const insertSurgeArresterWorkTaskTransaction = async (
  surgeArresterWorkTask: {
    mrid: string
    test_type_surge_arrester_id: string | null
    test_standard_id: string | null
  },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workTaskResult: any = await workTaskFunc.insertWorkTaskTransaction(
        surgeArresterWorkTask,
        dbsql
      )
      if (!workTaskResult.success) {
        return reject({
          success: false,
          message: 'Insert workTask failed',
          err: workTaskResult.err
        })
      }
      dbsql.run(
        `INSERT INTO surge_arrester_work_task(
                    mrid, test_type_surge_arrester_id, test_standard_id
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    test_type_surge_arrester_id = excluded.test_type_surge_arrester_id,
                    test_standard_id = excluded.test_standard_id
                `,
        [
          surgeArresterWorkTask.mrid,
          surgeArresterWorkTask.test_type_surge_arrester_id,
          surgeArresterWorkTask.test_standard_id
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err)
            return reject({ success: false, err, message: 'Insert surgeArresterWorkTask failed' })
          return resolve({
            success: true,
            data: surgeArresterWorkTask,
            message: 'Insert surgeArresterWorkTask completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert surgeArresterWorkTask failed' })
    }
  })
}

export const updateSurgeArresterWorkTaskByIdTransaction = async (
  mrid: string,
  surgeArresterWorkTask: {
    test_type_surge_arrester_id: string | null
    test_standard_id: string | null
  },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workTaskResult: any = await workTaskFunc.updateWorkTaskByIdTransaction(
        mrid,
        surgeArresterWorkTask,
        dbsql
      )
      if (!workTaskResult.success) {
        return reject({
          success: false,
          message: 'Update workTask failed',
          err: workTaskResult.err
        })
      }
      dbsql.run(
        `UPDATE surge_arrester_work_task SET
                    test_type_surge_arrester_id = ?,
                    test_standard_id = ?
                WHERE mrid = ?`,
        [
          surgeArresterWorkTask.test_type_surge_arrester_id,
          surgeArresterWorkTask.test_standard_id,
          mrid
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err)
            return reject({ success: false, err, message: 'Update surgeArresterWorkTask failed' })
          return resolve({
            success: true,
            data: surgeArresterWorkTask,
            message: 'Update surgeArresterWorkTask completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update surgeArresterWorkTask failed' })
    }
  })
}

export const deleteSurgeArresterWorkTaskByIdTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM surge_arrester_work_task WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err)
            return reject({ success: false, err, message: 'Delete surgeArresterWorkTask failed' })
          if (this.changes === 0)
            return resolve({
              success: false,
              data: null,
              message: 'SurgeArresterWorkTask not found'
            })
          workTaskFunc.deleteWorkTaskByIdTransaction(mrid, dbsql)
          return resolve({
            success: true,
            data: null,
            message: 'Delete surgeArresterWorkTask completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete surgeArresterWorkTask failed' })
    }
  })
}
