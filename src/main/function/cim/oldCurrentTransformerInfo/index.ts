import * as CurrentTransformerInfoFunc from '../currentTransformerInfo/index'
import db from '../../datacontext/index'

export const insertOldCurrentTransformerInfoTransaction = async (info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentTransformerInfoResult: any =
        await CurrentTransformerInfoFunc.insertCurrentTransformerInfo(info, dbsql)
      if (!currentTransformerInfoResult.success) {
        return reject({
          success: false,
          message: 'Insert currentTransformerInfo failed',
          err: currentTransformerInfoResult.err
        })
      }
      dbsql.run(
        `INSERT INTO old_current_transformer_info(
                    mrid, standard, rated_frequency, primary_winding_count, um_rms, u_withstand_rms, u_lightning_peak, i_cth, i_dynamic_peak, ith_rms, ith_duration, system_voltage, system_voltage_type, bil, rating_factor, rating_factor_temp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    standard = excluded.standard,
                    rated_frequency = excluded.rated_frequency,
                    primary_winding_count = excluded.primary_winding_count,
                    um_rms = excluded.um_rms,
                    u_withstand_rms = excluded.u_withstand_rms,
                    u_lightning_peak = excluded.u_lightning_peak,
                    i_cth = excluded.i_cth,
                    i_dynamic_peak = excluded.i_dynamic_peak,
                    ith_rms = excluded.ith_rms,
                    ith_duration = excluded.ith_duration,
                    system_voltage = excluded.system_voltage,
                    system_voltage_type = excluded.system_voltage_type,
                    bil = excluded.bil,
                    rating_factor = excluded.rating_factor,
                    rating_factor_temp = excluded.rating_factor_temp
                `,
        [
          info.mrid,
          info.standard,
          info.rated_frequency,
          info.primary_winding_count,
          info.um_rms,
          info.u_withstand_rms,
          info.u_lightning_peak,
          info.i_cth,
          info.i_dynamic_peak,
          info.ith_rms,
          info.ith_duration,
          info.system_voltage,
          info.system_voltage_type,
          info.bil,
          info.rating_factor,
          info.rating_factor_temp
        ],
        function (err: any) {
          if (err) {
            return reject({
              success: false,
              err,
              message: 'Insert oldCurrentTransformerInfo failed'
            })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Insert oldCurrentTransformerInfo completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Insert oldCurrentTransformerInfo transaction failed'
      })
    }
  })
}

export const getOldCurrentTransformerInfoById = async (mrid: string) => {
  try {
    const baseResult: any = await CurrentTransformerInfoFunc.getCurrentTransformerInfoById(mrid)
    if (!baseResult.success) {
      return { success: false, data: null, message: 'CurrentTransformerInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM old_current_transformer_info WHERE mrid=?`,
        [mrid],
        (err: any, row: any) => {
          if (err)
            return reject({
              success: false,
              err,
              message: 'Get oldCurrentTransformerInfo by id failed'
            })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'OldCurrentTransformerInfo not found'
            })
          return resolve({
            success: true,
            data: { ...baseResult.data, ...row },
            message: 'Get oldCurrentTransformerInfo by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get oldCurrentTransformerInfo by id failed' }
  }
}
