import db from '../../datacontext/index'
import * as AssetFunc from '../asset/index.js'

export const getOperatingMechanismById = async (mrid: string) => {
  try {
    const assetRes: any = await AssetFunc.getAssetById(mrid)
    if (!assetRes.success) return { success: false, data: null, message: 'Asset not found' }

    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM operating_mechanism WHERE mrid = ?',
        [mrid],
        (err: Error | null, row: any) => {
          if (err)
            return reject({ success: false, err, message: 'Get operatingMechanism by id failed' })
          if (!row)
            return resolve({ success: false, data: null, message: 'OperatingMechanism not found' })
          return resolve({
            success: true,
            data: { ...assetRes.data, ...row },
            message: 'Get operatingMechanism by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get operatingMechanism by id failed' }
  }
}

export const getOperatingMechanismByAssetId = async (assetId: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM operating_mechanism WHERE asset_id = ?',
      [assetId],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get operatingMechanism by asset_id failed'
          })
        if (!row)
          return resolve({ success: false, data: null, message: 'OperatingMechanism not found' })
        return resolve({
          success: true,
          data: row,
          message: 'Get operatingMechanism by asset_id completed'
        })
      }
    )
  })
}

export const insertOperatingMechanismTransaction = async (
  info: { mrid: string; asset_id?: string | null },
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetRes: any = await AssetFunc.insertAssetTransaction(info, dbsql)
      if (!assetRes.success)
        return reject({ success: false, message: 'Insert Asset failed', err: assetRes.err })

      dbsql.run(
        `INSERT INTO operating_mechanism(mrid, asset_id)
                 VALUES (?, ?)
                 ON CONFLICT(mrid) DO UPDATE SET asset_id = excluded.asset_id`,
        [info.mrid, info.asset_id || null],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err)
            return reject({ success: false, err, message: 'Insert operatingMechanism failed' })
          return resolve({
            success: true,
            data: info,
            message: 'Insert operatingMechanism completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Insert operatingMechanism transaction failed'
      })
    }
  })
}

export const updateOperatingMechanismTransaction = async (
  mrid: string,
  info: { asset_id?: string | null },
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assetRes: any = await AssetFunc.updateAssetTransaction(mrid, info, dbsql)
      if (!assetRes.success)
        return reject({ success: false, message: 'Update Asset failed', err: assetRes.err })

      dbsql.run(
        `UPDATE operating_mechanism SET asset_id = ? WHERE mrid = ?`,
        [info.asset_id || null, mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err)
            return reject({ success: false, err, message: 'Update operatingMechanism failed' })
          return resolve({
            success: true,
            data: info,
            message: 'Update operatingMechanism completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Update operatingMechanism transaction failed'
      })
    }
  })
}

export const deleteOperatingMechanismTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM operating_mechanism WHERE mrid = ?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err)
            return reject({ success: false, err, message: 'Delete operatingMechanism failed' })

          AssetFunc.deleteAssetByIdTransaction(mrid, dbsql)
            .then((res: any) => {
              if (!res.success)
                return reject({ success: false, message: 'Delete Asset failed', err: res.err })
              return resolve({
                success: true,
                data: mrid,
                message: 'Delete operatingMechanism completed'
              })
            })
            .catch((err2: Error) =>
              reject({ success: false, err: err2, message: 'Delete Asset transaction failed' })
            )
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Delete operatingMechanism transaction failed'
      })
    }
  })
}
