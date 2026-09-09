import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const getIOPointById = async (mrid: string) => {
  try {
    const identifiedObject: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
    if (!identifiedObject.success) {
      return { success: false, data: null, message: 'IdentifiedObject not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM iopoint WHERE mrid=?`, [mrid], (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get iopoint by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'IOPoint not found' })
        return resolve({
          success: true,
          data: { ...identifiedObject.data, ...row },
          message: 'Get iopoint by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get iopoint by id failed' }
  }
}

export const insertIOPointTransaction = async (
  iopoint: { mrid: string; iopoint_source: string | null },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idObjResult: any = await identifiedObjectFunc.insertIdentifiedObjectTransaction(
        iopoint,
        dbsql
      )
      if (!idObjResult.success) {
        return reject({
          success: false,
          message: 'Insert identifiedObject failed',
          err: idObjResult.err
        })
      }
      dbsql.run(
        `INSERT INTO iopoint(
                    mrid, iopoint_source
                ) VALUES (?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    iopoint_source = excluded.iopoint_source
                `,
        [iopoint.mrid, iopoint.iopoint_source],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert iopoint failed' })
          return resolve({ success: true, data: iopoint, message: 'Insert iopoint completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert iopoint failed' })
    }
  })
}

export const updateIOPointByIdTransaction = async (
  mrid: string,
  iopoint: { iopoint_source: string | null },
  dbsql: typeof db
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idObjResult: any = await identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(
        mrid,
        iopoint,
        dbsql
      )
      if (!idObjResult.success) {
        return reject({
          success: false,
          message: 'Update identifiedObject failed',
          err: idObjResult.err
        })
      }
      dbsql.run(
        `UPDATE iopoint SET
                    iopoint_source = ?
                WHERE mrid = ?`,
        [iopoint.iopoint_source, mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update iopoint failed' })
          return resolve({ success: true, data: iopoint, message: 'Update iopoint completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update iopoint failed' })
    }
  })
}

export const deleteIOPointByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM iopoint WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete iopoint failed' })
          if (this.changes === 0)
            return resolve({ success: false, data: null, message: 'IOPoint not found' })
          identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
          return resolve({ success: true, data: null, message: 'Delete iopoint completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete iopoint failed' })
    }
  })
}
