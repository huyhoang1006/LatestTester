import db from '../../datacontext/index'
import * as AssetFunc from '../asset/index'

export const getBushingById = async (mrid: string) => {
  try {
    const assetResult: any = await AssetFunc.getAssetById(mrid)
    if (!assetResult.success) {
      return { success: false, data: null, message: 'Asset not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM bushing WHERE mrid=?`, [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get bushing by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'Bushing not found' })
        return resolve({
          success: true,
          data: { ...assetResult.data, ...row },
          message: 'Get bushing by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get bushing by id failed' }
  }
}

export const insertBushingTransaction = async (info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetResult: any = await AssetFunc.insertAssetTransaction(info, dbsql)
      if (!assetResult.success) {
        return reject({ success: false, message: 'Insert asset failed', err: assetResult.err })
      }
      dbsql.run(
        `INSERT INTO bushing(
                    mrid, terminal, moving_contact, fixed_contact
                ) VALUES (?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    terminal = excluded.terminal,
                    moving_contact = excluded.moving_contact,
                    fixed_contact = excluded.fixed_contact
                `,
        [info.mrid, info.terminal, info.moving_contact, info.fixed_contact],
        function (err: any) {
          if (err) {
            return reject({ success: false, err, message: 'Insert bushing failed' })
          }
          return resolve({ success: true, data: info, message: 'Insert bushing completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert bushing transaction failed' })
    }
  })
}

export const updateBushingTransaction = async (mrid: string, info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetResult: any = await AssetFunc.updateAssetTransaction(mrid, info, dbsql)
      if (!assetResult.success) {
        return reject({ success: false, message: 'Update asset failed', err: assetResult.err })
      }
      dbsql.run(
        `UPDATE bushing SET
                    terminal = ?,
                    moving_contact = ?,
                    fixed_contact = ?
                WHERE mrid = ?`,
        [info.terminal, info.moving_contact, info.fixed_contact, mrid],
        function (err: any) {
          if (err) {
            return reject({ success: false, err, message: 'Update bushing failed' })
          }
          return resolve({ success: true, data: info, message: 'Update bushing completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update bushing transaction failed' })
    }
  })
}

export const deleteBushingTransaction = async (mrid: string, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetResult: any = await AssetFunc.deleteAssetByIdTransaction(mrid, dbsql)
      if (!assetResult.success) {
        return reject({ success: false, message: 'Delete asset failed', err: assetResult.err })
      }
      dbsql.run('DELETE FROM bushing WHERE mrid=?', [mrid], function (err: any) {
        if (err) {
          return reject({ success: false, err, message: 'Delete bushing failed' })
        }
        return resolve({ success: true, data: mrid, message: 'Delete bushing completed' })
      })
    } catch (err) {
      return reject({ success: false, err, message: 'Delete bushing transaction failed' })
    }
  })
}

export const getBushingByPsrId = (psrId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT 
                sa.*, 
                a.*,
                io.name AS apparatus_id,
                io.alias_name,
                io.description,
                pam.manufacturer,
                ai.manufacturer_type AS asset_info_manufacturer_type,
                ld.manufactured_date AS manufacturing_year
            FROM bushing sa
            INNER JOIN asset a ON sa.mrid = a.mrid
            INNER JOIN asset_psr ap ON a.mrid = ap.asset_id
            LEFT JOIN identified_object io ON a.mrid = io.mrid
            LEFT JOIN product_asset_model pam ON a.product_asset_model = pam.mrid
            LEFT JOIN asset_info ai ON a.asset_info = ai.mrid
            LEFT JOIN lifecycle_date ld ON a.lifecycle_date = ld.mrid
            WHERE ap.psr_id = ?
        `

    db.all(query, [psrId], (err: any, rows: any) => {
      if (err) {
        reject({
          success: false,
          error: err.message,
          message: 'Database query failed when getting Bushing by PSR ID'
        })
        return
      }

      if (!rows || rows.length === 0) {
        resolve({
          success: false,
          data: [],
          message: `No Bushing found for PSR ID: ${psrId}`
        })
        return
      }

      resolve({
        success: true,
        data: rows,
        message: 'Bushing with asset data retrieved successfully'
      })
    })
  })
}
