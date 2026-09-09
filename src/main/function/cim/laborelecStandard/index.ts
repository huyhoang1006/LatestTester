import * as standardFunc from '../standard/index'
import db from '../../datacontext/index'
import { runPromise } from '../common/index'

// Lấy laborelecStandard theo mrid
export const getLaborelecStandardById = async (mrid: string) => {
  return new Promise<any>((resolve, reject) => {
    db.get(`SELECT * FROM laborelec_standard WHERE mrid=?`, [mrid], (err, row) => {
      if (err) return reject({ success: false, err, message: 'Get laborelecStandard by id failed' })
      if (!row)
        return resolve({ success: false, data: null, message: 'LaborelecStandard not found' })
      return resolve({ success: true, data: row, message: 'Get laborelecStandard by id completed' })
    })
  })
}

// Thêm mới laborelecStandard
export const insertLaborelecStandardTransaction = async (data: any, dbsql: any) => {
  // 1. insert standard
  const result: any = await (standardFunc as any).insertStandardTransaction(data, dbsql)

  if (!result.success) {
    throw new Error('Insert standard failed')
  }

  // 2. upsert laborelec_standard
  await runPromise(
    dbsql as any,
    `INSERT INTO laborelec_standard (mrid, standard_edition, standard_number)
     VALUES (?, ?, ?)
     ON CONFLICT(mrid) DO UPDATE SET
       standard_edition = excluded.standard_edition,
       standard_number = excluded.standard_number`,
    [data.mrid, data.standard_edition, data.standard_number]
  )

  return { success: true }
}
// Xóa laborelecStandard
export const deleteLaborelecStandardByIdTransaction = async (mrid: string, dbsql: any) => {
  // optional → không cần check
  await runPromise(dbsql as any, 'DELETE FROM laborelec_standard WHERE mrid=?', [mrid])

  // core → phải check
  const result: any = await (standardFunc as any).deleteStandardByIdTransaction(mrid, dbsql)

  if (!result.success) {
    throw new Error('Delete related standard failed')
  }

  return { success: true }
}
