import db from '../../datacontext/index'
import * as PowerTransformerInfoFunc from '../powerTransformerInfo/index'

export const getOldPowerTransformerInfoById = async (mrid: string) => {
  try {
    const baseResult: any = await PowerTransformerInfoFunc.getPowerTransformerInfoById(mrid)
    if (!baseResult.success) {
      return { success: false, data: null, message: 'PowerTransformerInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM old_power_transformer_info WHERE mrid=?`,
        [mrid],
        (err: any, row: any) => {
          if (err)
            return reject({
              success: false,
              err,
              message: 'Get oldPowerTransformerInfo by id failed'
            })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'OldPowerTransformerInfo not found'
            })
          return resolve({
            success: true,
            data: { ...baseResult.data, ...row },
            message: 'Get oldPowerTransformerInfo by id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get oldPowerTransformerInfo by id failed' }
  }
}

export const insertOldPowerTransformerInfoTransaction = async (info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseResult: any = await PowerTransformerInfoFunc.insertPowerTransformerInfoTransaction(
        info,
        dbsql
      )
      if (!baseResult.success) {
        return reject({
          success: false,
          message: 'Insert powerTransformerInfo failed',
          err: baseResult.err
        })
      }
      dbsql.run(
        `INSERT INTO old_power_transformer_info(
                    mrid, phases, vector_group, rated_frequency, impedance_temperature, category, apparatus_id, vector_group_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    phases = excluded.phases,
                    vector_group = excluded.vector_group,
                    rated_frequency = excluded.rated_frequency,
                    impedance_temperature = excluded.impedance_temperature,
                    category = excluded.category,
                    apparatus_id = excluded.apparatus_id,
                    vector_group_type = excluded.vector_group_type
                `,
        [
          info.mrid,
          info.phases,
          info.vector_group,
          info.rated_frequency,
          info.impedance_temperature,
          info.category,
          info.apparatus_id,
          info.vector_group_type
        ],
        function (err: any) {
          if (err) {
            return reject({ success: false, err, message: 'Insert oldPowerTransformerInfo failed' })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Insert oldPowerTransformerInfo completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Insert oldPowerTransformerInfo transaction failed'
      })
    }
  })
}

export const updateOldPowerTransformerInfoTransaction = async (
  mrid: string,
  info: any,
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseResult: any = await PowerTransformerInfoFunc.updatePowerTransformerInfoTransaction(
        mrid,
        info,
        dbsql
      )
      if (!baseResult.success) {
        return reject({
          success: false,
          message: 'Update powerTransformerInfo failed',
          err: baseResult.err
        })
      }
      dbsql.run(
        `UPDATE old_power_transformer_info SET
                    phases = ?,
                    vector_group = ?,
                    rated_frequency = ?,
                    impedance_temperature = ?,
                    category = ?,
                    apparatus_id = ?
                    vector_group_type = ?
                WHERE mrid = ?`,
        [
          info.phases,
          info.vector_group,
          info.rated_frequency,
          info.impedance_temperature,
          info.category,
          info.apparatus_id,
          info.vector_group_type,
          mrid
        ],
        function (err: any) {
          if (err) {
            return reject({ success: false, err, message: 'Update oldPowerTransformerInfo failed' })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Update oldPowerTransformerInfo completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Update oldPowerTransformerInfo transaction failed'
      })
    }
  })
}

export const deleteOldPowerTransformerInfoTransaction = async (mrid: string, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseResult: any = await PowerTransformerInfoFunc.deletePowerTransformerInfoTransaction(
        mrid,
        dbsql
      )
      if (!baseResult.success) {
        return reject({
          success: false,
          message: 'Delete powerTransformerInfo failed',
          err: baseResult.err
        })
      }
      dbsql.run('DELETE FROM old_power_transformer_info WHERE mrid=?', [mrid], function (err: any) {
        if (err) {
          return reject({ success: false, err, message: 'Delete oldPowerTransformerInfo failed' })
        }
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete oldPowerTransformerInfo completed'
        })
      })
    } catch (err) {
      return reject({
        success: false,
        err,
        message: 'Delete oldPowerTransformerInfo transaction failed'
      })
    }
  })
}
