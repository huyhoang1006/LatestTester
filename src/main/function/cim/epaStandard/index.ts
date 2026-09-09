import * as standardFunc from '../standard/index'
import db from '../../datacontext/index'
import { runPromise } from '../common/index'

// Lấy epaStandard theo mrid
export const getEpaStandardById = async (mrid: string) => {
  return new Promise<any>((resolve, reject) => {
    db.get(`SELECT * FROM epa_standard WHERE mrid=?`, [mrid], (err, row) => {
      if (err) return reject({ success: false, err, message: 'Get epaStandard by id failed' })
      if (!row) return resolve({ success: false, data: null, message: 'EpaStandard not found' })
      return resolve({ success: true, data: row, message: 'Get epaStandard by id completed' })
    })
  })
}

// Thêm mới epaStandard
export const insertEpaStandardTransaction = async (data: any, dbsql: any) => {
  // 1. insert standard
  const result: any = await (standardFunc as any).insertStandardTransaction(data, dbsql)

  if (!result.success) {
    throw new Error('Insert standard failed')
  }

  // 2. upsert epa_standard
  await runPromise(
    dbsql as any,
    `INSERT INTO epa_standard (mrid, standard_edition, standard_number)
     VALUES (?, ?, ?)
     ON CONFLICT(mrid) DO UPDATE SET
       standard_edition = excluded.standard_edition,
       standard_number = excluded.standard_number`,
    [data.mrid, data.standard_edition, data.standard_number]
  )

  return { success: true }
}
// Xóa epaStandard
export const deleteEpaStandardByIdTransaction = async (mrid: string, dbsql: any) => {
  // optional → không cần check
  await runPromise(dbsql as any, 'DELETE FROM epa_standard WHERE mrid=?', [mrid])

  // core → phải check
  const result: any = await (standardFunc as any).deleteStandardByIdTransaction(mrid, dbsql)

  if (!result.success) {
    throw new Error('Delete related standard failed')
  }

  return { success: true }
}
