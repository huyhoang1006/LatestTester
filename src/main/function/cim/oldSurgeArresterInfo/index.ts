import db from '../../datacontext/index'
import * as SurgeArresterInfoFunc from '../surgeArresterInfo/index'

export const getOldSurgeArresterInfoById = async (mrid: string) => {
  try {
    const arresterInfoResult: any = await SurgeArresterInfoFunc.getSurgeArresterInfoById(mrid)
    if (!arresterInfoResult.success) {
      return { success: false, data: null, message: 'SurgeArresterInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM old_surge_arrester_info WHERE mrid=?', [mrid], (err: any, row: any) => {
        if (err)
          return reject({
            success: false,
            err: err,
            message: 'Get old surge arrester info by id failed'
          })
        if (!row)
          return resolve({ success: false, data: null, message: 'OldSurgeArresterInfo not found' })
        const data = { ...arresterInfoResult.data, ...row }
        return resolve({
          success: true,
          data: data,
          message: 'Get old surge arrester info by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err: err, message: 'Get old surge arrester info by id failed' }
  }
}

export const getOldSurgeArresterInfoBySurgeArresterId = (surgeArresterId: string) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT 
                oi.*, 
                ai.*, 
                sai.*, 
                oai.*
            FROM asset a
            INNER JOIN asset_info ai 
                ON a.asset_info = ai.mrid
            INNER JOIN surge_arrester_info sai 
                ON sai.mrid = ai.mrid
            INNER JOIN old_surge_arrester_info oai 
                ON oai.mrid = sai.mrid
            INNER JOIN identified_object oi 
                ON oi.mrid = ai.mrid
            WHERE a.mrid = ?
        `

    db.get(query, [surgeArresterId], (err: any, row: any) => {
      if (err) {
        return reject({
          success: false,
          err: err,
          message: 'Get old surge arrester info failed'
        })
      }

      if (!row) {
        return resolve({
          success: false,
          data: null,
          message: 'No old surge arrester info found'
        })
      }

      return resolve({
        success: true,
        data: row,
        message: 'Get old surge arrester info completed'
      })
    })
  })
}

export const insertOldSurgeArresterInfo = async (info: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      SurgeArresterInfoFunc.insertSurgeArresterInfoTransaction(info, db)
        .then((arresterInfoResult: any) => {
          if (!arresterInfoResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert surgeArresterInfo failed',
              err: arresterInfoResult.err
            })
          }
          db.run(
            `INSERT INTO old_surge_arrester_info(
                            mrid, maximum_system_voltage, short_time_with_stand_current,
                            rated_duration_of_short_circuit, pf_with_stand_voltage_earth_between_pole,
                            pf_with_stand_voltage_isolated_distance, voltage_ll, voltage_ln, transformer_end_info
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            maximum_system_voltage = excluded.maximum_system_voltage,
                            short_time_with_stand_current = excluded.short_time_with_stand_current,
                            rated_duration_of_short_circuit = excluded.rated_duration_of_short_circuit,
                            pf_with_stand_voltage_earth_between_pole = excluded.pf_with_stand_voltage_earth_between_pole,
                            pf_with_stand_voltage_isolated_distance = excluded.pf_with_stand_voltage_isolated_distance,
                            voltage_ll = excluded.voltage_ll,
                            voltage_ln = excluded.voltage_ln,
                            transformer_end_info = excluded.transformer_end_info
                        `,
            [
              info.mrid,
              info.maximum_system_voltage,
              info.short_time_with_stand_current,
              info.rated_duration_of_short_circuit,
              info.pf_with_stand_voltage_earth_between_pole,
              info.pf_with_stand_voltage_isolated_distance,
              info.voltage_ll,
              info.voltage_ln,
              info.transformer_end_info
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({
                  success: false,
                  err: err,
                  message: 'Insert old surge arrester info failed'
                })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: info,
                message: 'Insert old surge arrester info completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err: err,
            message: 'Insert old surge arrester info transaction failed'
          })
        })
    })
  })
}

export const insertOldSurgeArresterInfoTransaction = (info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const arresterInfoResult: any =
        await SurgeArresterInfoFunc.insertSurgeArresterInfoTransaction(info, dbsql)
      if (!arresterInfoResult.success) {
        return reject({
          success: false,
          message: 'Insert surgeArresterInfo failed',
          err: arresterInfoResult.err
        })
      }
      dbsql.run(
        `INSERT INTO old_surge_arrester_info(
                    mrid, maximum_system_voltage, short_time_with_stand_current,
                    rated_duration_of_short_circuit, pf_with_stand_voltage_earth_between_pole,
                    pf_with_stand_voltage_isolated_distance, voltage_ll, voltage_ln, phase, transformer_end_info
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    maximum_system_voltage = excluded.maximum_system_voltage,
                    short_time_with_stand_current = excluded.short_time_with_stand_current,
                    rated_duration_of_short_circuit = excluded.rated_duration_of_short_circuit,
                    pf_with_stand_voltage_earth_between_pole = excluded.pf_with_stand_voltage_earth_between_pole,
                    pf_with_stand_voltage_isolated_distance = excluded.pf_with_stand_voltage_isolated_distance,
                    voltage_ll = excluded.voltage_ll,
                    voltage_ln = excluded.voltage_ln,
                    phase = excluded.phase,
                    transformer_end_info = excluded.transformer_end_info
                `,
        [
          info.mrid,
          info.maximum_system_voltage,
          info.short_time_with_stand_current,
          info.rated_duration_of_short_circuit,
          info.pf_with_stand_voltage_earth_between_pole,
          info.pf_with_stand_voltage_isolated_distance,
          info.voltage_ll,
          info.voltage_ln,
          info.phase,
          info.transformer_end_info
        ],
        function (err: any) {
          if (err) {
            console.log(err)
            return reject({
              success: false,
              err: err,
              message: 'Insert old surge arrester info transaction failed'
            })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Insert old surge arrester info transaction completed'
          })
        }
      )
    } catch (err) {
      console.log(err)
      return reject({
        success: false,
        err: err,
        message: 'Insert old surge arrester info transaction failed'
      })
    }
  })
}

export const updateOldSurgeArresterInfo = async (mrid: string, info: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      SurgeArresterInfoFunc.updateSurgeArresterInfoTransaction(mrid, info, db)
        .then((arresterInfoResult: any) => {
          if (!arresterInfoResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update surgeArresterInfo failed',
              err: arresterInfoResult.err
            })
          }
          db.run(
            `UPDATE old_surge_arrester_info SET
                            maximum_system_voltage = ?,
                            short_time_with_stand_current = ?,
                            rated_duration_of_short_circuit = ?,
                            pf_with_stand_voltage_earth_between_pole = ?,
                            pf_with_stand_voltage_isolated_distance = ?,
                            voltage_ll = ?,
                            voltage_ln = ?,
                            phase = ?,
                            transformer_end_info = ?
                        WHERE mrid = ?`,
            [
              info.maximum_system_voltage,
              info.short_time_with_stand_current,
              info.rated_duration_of_short_circuit,
              info.pf_with_stand_voltage_earth_between_pole,
              info.pf_with_stand_voltage_isolated_distance,
              info.voltage_ll,
              info.voltage_ln,
              info.phase,
              info.transformer_end_info,
              mrid
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({
                  success: false,
                  err: err,
                  message: 'Update old surge arrester info failed'
                })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: info,
                message: 'Update old surge arrester info completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err: err,
            message: 'Update old surge arrester info transaction failed'
          })
        })
    })
  })
}

export const updateOldSurgeArresterInfoTransaction = (mrid: string, info: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const arresterInfoResult: any =
        await SurgeArresterInfoFunc.updateSurgeArresterInfoTransaction(mrid, info, dbsql)
      if (!arresterInfoResult.success) {
        return reject({
          success: false,
          message: 'Update surgeArresterInfo failed',
          err: arresterInfoResult.err
        })
      }
      dbsql.run(
        `UPDATE old_surge_arrester_info SET
                    maximum_system_voltage = ?,
                    short_time_with_stand_current = ?,
                    rated_duration_of_short_circuit = ?,
                    pf_with_stand_voltage_earth_between_pole = ?,
                    pf_with_stand_voltage_isolated_distance = ?,
                    voltage_ll = ?,
                    voltage_ln = ?,
                    phase = ?,
                    transformer_end_info = ?
                WHERE mrid = ?`,
        [
          info.maximum_system_voltage,
          info.short_time_with_stand_current,
          info.rated_duration_of_short_circuit,
          info.pf_with_stand_voltage_earth_between_pole,
          info.pf_with_stand_voltage_isolated_distance,
          info.voltage_ll,
          info.voltage_ln,
          info.phase,
          info.transformer_end_info,
          mrid
        ],
        function (err: any) {
          if (err) {
            return reject({
              success: false,
              err: err,
              message: 'Update old surge arrester info transaction failed'
            })
          }
          return resolve({
            success: true,
            data: info,
            message: 'Update old surge arrester info transaction completed'
          })
        }
      )
    } catch (err) {
      return reject({
        success: false,
        err: err,
        message: 'Update old surge arrester info transaction failed'
      })
    }
  })
}

export const deleteOldSurgeArresterInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    SurgeArresterInfoFunc.deleteSurgeArresterInfoById(mrid)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete surgeArresterInfo failed',
            err: result.err
          })
        }
        db.run('DELETE FROM old_surge_arrester_info WHERE mrid=?', [mrid], function (err: any) {
          if (err) {
            return reject({
              success: false,
              err: err,
              message: 'Delete old surge arrester info failed'
            })
          }
          return resolve({
            success: true,
            data: mrid,
            message: 'Delete old surge arrester info completed'
          })
        })
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err: err,
          message: 'Delete old surge arrester info transaction failed'
        })
      })
  })
}

export const deleteOldSurgeArresterInfoByIdTransaction = (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    SurgeArresterInfoFunc.deleteSurgeArresterInfoByIdTransaction(mrid, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete surgeArresterInfo failed',
            err: result.err
          })
        }
        dbsql.run('DELETE FROM old_surge_arrester_info WHERE mrid=?', [mrid], function (err: any) {
          if (err) {
            return reject({
              success: false,
              err: err,
              message: 'Delete old surge arrester info transaction failed'
            })
          }
          return resolve({
            success: true,
            data: mrid,
            message: 'Delete old surge arrester info transaction completed'
          })
        })
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err: err,
          message: 'Delete old surge arrester info transaction failed'
        })
      })
  })
}
