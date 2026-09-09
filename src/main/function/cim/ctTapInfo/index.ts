import dbsql from '@/function/datacontext/index'

export const insertCtTapInfoTransaction = async (info: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    try {
      dbsql.run(
        `INSERT INTO ct_tap_info(mrid, tap_name, ipn, isn, in_use, rated_burden, burden, extended_burden, burden_power_factor, operating_burden, operating_burden_power_factor, ct_core_info_id, type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    tap_name = excluded.tap_name,
                    ipn = excluded.ipn,
                    isn = excluded.isn,
                    in_use = excluded.in_use,
                    rated_burden = excluded.rated_burden,
                    burden = excluded.burden,
                    extended_burden = excluded.extended_burden,
                    burden_power_factor = excluded.burden_power_factor,
                    operating_burden = excluded.operating_burden,
                    operating_burden_power_factor = excluded.operating_burden_power_factor,
                    ct_core_info_id = excluded.ct_core_info_id,
                    type = excluded.type
                `,
        [
          info.mrid,
          info.tap_name,
          info.ipn,
          info.isn,
          info.in_use,
          info.rated_burden,
          info.burden,
          info.extended_burden,
          info.burden_power_factor,
          info.operating_burden,
          info.operating_burden_power_factor,
          info.ct_core_info_id,
          info.type
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) {
            return reject({ success: false, err, message: 'Insert ctTapInfo failed' })
          }
          return resolve({ success: true, data: info, message: 'Insert ctTapInfo completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert ctTapInfo transaction failed' })
    }
  })
}

export const getCtTapInfoByCtCoreInfoId = (ct_core_info_id: string) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ct_tap_info WHERE ct_core_info_id = ?`
    const params = [ct_core_info_id]
    dbsql.all(sql, params, function (err: Error | null, row: unknown[]) {
      if (err) return reject({ success: false, err, message: 'Get ctTapInfo failed' })
      return resolve({ success: true, data: row, message: 'Get ctTapInfo completed' })
    })
  })
}

export const deleteCtTapInfoByCtCoreInfoIdTransaction = (ct_core_info_id: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM ct_tap_info WHERE ct_core_info_id = ?`
    const params = [ct_core_info_id]
    dbsql.run(sql, params, function (this: { lastID: number; changes: number }, err: Error | null) {
      if (err) return reject({ success: false, err, message: 'Delete ctTapInfo failed' })
      return resolve({
        success: true,
        data: ct_core_info_id,
        message: 'Delete ctTapInfo completed'
      })
    })
  })
}
