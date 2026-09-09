import * as AssetInfoFunc from '../assetInfo/index'
import db from '../../datacontext/index'

export const insertCurrentTransformerInfo = async (info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        `INSERT INTO current_transformer_info(
                    mrid, accuracy_class, accuracy_limit, core_count, ct_class, knee_point_current, knee_point_voltage, max_ratio, nominal_ratio, primary_fls_rating, primary_ratio, rated_current, secondary_fls_rating, secondary_ratio, tertiary_fls_rating, tertiary_ratio, usage
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    accuracy_class = excluded.accuracy_class,
                    accuracy_limit = excluded.accuracy_limit,
                    core_count = excluded.core_count,
                    ct_class = excluded.ct_class,
                    knee_point_current = excluded.knee_point_current,
                    knee_point_voltage = excluded.knee_point_voltage,
                    max_ratio = excluded.max_ratio,
                    nominal_ratio = excluded.nominal_ratio,
                    primary_fls_rating = excluded.primary_fls_rating,
                    primary_ratio = excluded.primary_ratio,
                    rated_current = excluded.rated_current,
                    secondary_fls_rating = excluded.secondary_fls_rating,
                    secondary_ratio = excluded.secondary_ratio,
                    tertiary_fls_rating = excluded.tertiary_fls_rating,
                    tertiary_ratio = excluded.tertiary_ratio,
                    usage = excluded.usage
                `,
        [
          info.mrid,
          info.accuracy_class,
          info.accuracy_limit,
          info.core_count,
          info.ct_class,
          info.knee_point_current,
          info.knee_point_voltage,
          info.max_ratio,
          info.nominal_ratio,
          info.primary_fls_rating,
          info.primary_ratio,
          info.rated_current,
          info.secondary_fls_rating,
          info.secondary_ratio,
          info.tertiary_fls_rating,
          info.tertiary_ratio,
          info.usage
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) {
            return reject({ success: false, err, message: 'Insert currentTransformerInfo failed' })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Insert currentTransformerInfo completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Insert currentTransformerInfo transaction failed'
      })
    }
  })
}

export const getCurrentTransformerInfoById = async (mrid: string) => {
  try {
    const baseResult: any = await AssetInfoFunc.getAssetInfoById(mrid)
    if (!baseResult.success) {
      return { success: false, data: null, message: 'CurrentTransformerInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM current_transformer_info WHERE mrid=?`,
        [mrid],
        (err: Error | null, row: any) => {
          if (err)
            return reject({
              success: false,
              err,
              message: 'Get currentTransformerInfo by id failed'
            })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'CurrentTransformerInfo not found'
            })
          return resolve({
            success: true,
            data: { ...baseResult.data, ...row },
            message: 'Get currentTransformerInfo by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get currentTransformerInfo by id failed' }
  }
}
