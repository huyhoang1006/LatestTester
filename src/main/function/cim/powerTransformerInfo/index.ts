import db from '../../datacontext/index'
import * as AssetInfoFunc from '../assetInfo/index.js'

export const getPowerTransformerInfoById = async (mrid: string) => {
  try {
    const assetInfoResult: any = await AssetInfoFunc.getAssetInfoById(mrid)
    if (!assetInfoResult.success) {
      return { success: false, data: null, message: 'AssetInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM power_transformer_info WHERE mrid=?',
        [mrid],
        (err: Error | null, row: any) => {
          if (err)
            return reject({ success: false, err, message: 'Get powerTransformerInfo by id failed' })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'PowerTransformerInfo not found'
            })
          const data = { ...assetInfoResult.data, ...row }
          return resolve({
            success: true,
            data: data,
            message: 'Get powerTransformerInfo by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err: err, message: 'Get powerTransformerInfo by id failed' }
  }
}

export const insertPowerTransformerInfoTransaction = async (info: any, dbsql: any) => {
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
        `INSERT INTO power_transformer_info(mrid)
                 VALUES (?)
                 ON CONFLICT(mrid) DO NOTHING`,
        [info.mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) {
            return reject({
              success: false,
              err: err,
              message: 'Insert powerTransformerInfo failed'
            })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Insert powerTransformerInfo completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err: err,
        message: 'Insert powerTransformerInfo transaction failed'
      })
    }
  })
}

export const updatePowerTransformerInfoTransaction = async (
  mrid: string,
  info: any,
  dbsql: any
) => {
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
      return resolve({
        success: true,
        data: info,
        message: 'Update powerTransformerInfo completed'
      })
    } catch (err) {
      return reject({
        success: false,
        err: err,
        message: 'Update powerTransformerInfo transaction failed'
      })
    }
  })
}

export const deletePowerTransformerInfoTransaction = async (mrid: string, dbsql: any) => {
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
      dbsql.run(
        'DELETE FROM power_transformer_info WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) {
            return reject({
              success: false,
              err: err,
              message: 'Delete powerTransformerInfo failed'
            })
          }
          return resolve({
            success: true,
            data: mrid,
            message: 'Delete powerTransformerInfo completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err: err,
        message: 'Delete powerTransformerInfo transaction failed'
      })
    }
  })
}
