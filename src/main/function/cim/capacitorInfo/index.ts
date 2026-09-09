import db from '../../datacontext/index'
import * as AssetInfoFunc from '../assetInfo/index'

export const getCapacitorInfoById = async (mrid: string) => {
  try {
    const assetInfoResult: any = await AssetInfoFunc.getAssetInfoById(mrid)
    if (!assetInfoResult.success) {
      return { success: false, data: null, message: 'AssetInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM capacitor_info WHERE mrid=?`, [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get capacitorInfo by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'CapacitorInfo not found' })
        return resolve({
          success: true,
          data: { ...assetInfoResult.data, ...row },
          message: 'Get capacitorInfo by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get capacitorInfo by id failed' }
  }
}

export const insertCapacitorInfoTransaction = async (info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetInfoResult: any = await AssetInfoFunc.insertAssetInfoTransaction(info, dbsql)
      if (!assetInfoResult.success) {
        return reject({
          success: false,
          message: 'Insert assetInfo failed',
          err: assetInfoResult.err
        })
      }
      dbsql.run(
        `INSERT INTO capacitor_info(
                    mrid, phase_number, phase_name, rated_voltage, rated_current, rated_frequency,
                    rated_power, insulation_type, weight
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    phase_number = excluded.phase_number,
                    phase_name = excluded.phase_name,
                    rated_voltage = excluded.rated_voltage,
                    rated_current = excluded.rated_current,
                    rated_frequency = excluded.rated_frequency,
                    rated_power = excluded.rated_power,
                    insulation_type = excluded.insulation_type,
                    weight = excluded.weight
                `,
        [
          info.mrid,
          info.phase_number,
          info.phase_name,
          info.rated_voltage,
          info.rated_current,
          info.rated_frequency,
          info.rated_power,
          info.insulation_type,
          info.weight
        ],
        function (err: any) {
          if (err) {
            return reject({ success: false, err, message: 'Insert capacitorInfo failed' })
          }
          return resolve({ success: true, data: info, message: 'Insert capacitorInfo completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert capacitorInfo transaction failed' })
    }
  })
}

export const updateCapacitorInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetInfoResult: any = await AssetInfoFunc.updateAssetInfoTransaction(mrid, info, dbsql)
      if (!assetInfoResult.success) {
        return reject({
          success: false,
          message: 'Update assetInfo failed',
          err: assetInfoResult.err
        })
      }
      dbsql.run(
        `UPDATE capacitor_info SET
                    phase_number = ?,
                    phase_name = ?,
                    rated_voltage = ?,
                    rated_current = ?,
                    rated_frequency = ?,
                    rated_power = ?,
                    insulation_type = ?,
                    weight = ?
                WHERE mrid = ?`,
        [
          info.phase_number,
          info.phase_name,
          info.rated_voltage,
          info.rated_current,
          info.rated_frequency,
          info.rated_power,
          info.insulation_type,
          info.weight,
          mrid
        ],
        function (err: any) {
          if (err) {
            return reject({ success: false, err, message: 'Update capacitorInfo failed' })
          }
          return resolve({ success: true, data: info, message: 'Update capacitorInfo completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update capacitorInfo transaction failed' })
    }
  })
}

export const deleteCapacitorInfoTransaction = async (mrid: string, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetInfoResult: any = await AssetInfoFunc.deleteAssetInfoByIdTransaction(mrid, dbsql)
      if (!assetInfoResult.success) {
        return reject({
          success: false,
          message: 'Delete assetInfo failed',
          err: assetInfoResult.err
        })
      }
      dbsql.run('DELETE FROM capacitor_info WHERE mrid=?', [mrid], function (err: any) {
        if (err) {
          return reject({ success: false, err, message: 'Delete capacitorInfo failed' })
        }
        return resolve({ success: true, data: mrid, message: 'Delete capacitorInfo completed' })
      })
    } catch (err) {
      return reject({ success: false, err, message: 'Delete capacitorInfo transaction failed' })
    }
  })
}

export default {
  getCapacitorInfoById,
  insertCapacitorInfoTransaction,
  updateCapacitorInfoTransaction,
  deleteCapacitorInfoTransaction
}
