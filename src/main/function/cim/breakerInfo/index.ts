import db from '../../datacontext/index'
import * as OldSwitchInfoFunc from '../oldSwitchInfo/index.js'

export const getBreakerInfoById = async (mrid: string) => {
  try {
    const switchInfoResult: any = await OldSwitchInfoFunc.getOldSwitchInfoById(mrid)
    if (!switchInfoResult.success) {
      return { success: false, data: null, message: 'OldSwitchInfo not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM breaker_info WHERE mrid=?`, [mrid], (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get breakerInfo by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'BreakerInfo not found' })
        return resolve({
          success: true,
          data: { ...switchInfoResult.data, ...row },
          message: 'Get breakerInfo by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get breakerInfo by id failed' }
  }
}

export const insertBreakerInfoTransaction = async (
  info: { mrid: string; phase_trip: string | null },
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const switchInfoResult: any = await OldSwitchInfoFunc.insertOldSwitchInfoTransaction(
        info,
        dbsql
      )
      if (!switchInfoResult.success) {
        return reject({
          success: false,
          message: 'Insert OldSwitchInfo failed',
          err: switchInfoResult.err
        })
      }
      dbsql.run(
        `INSERT INTO breaker_info(
                    mrid, phase_trip
                ) VALUES (?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    phase_trip = excluded.phase_trip
                `,
        [info.mrid, info.phase_trip],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert breakerInfo failed' })
          return resolve({ success: true, data: info, message: 'Insert breakerInfo completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert breakerInfo transaction failed' })
    }
  })
}

export const updateBreakerInfoTransaction = async (
  mrid: string,
  info: { phase_trip: string | null },
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const switchInfoResult: any = await OldSwitchInfoFunc.updateOldSwitchInfoTransaction(
        mrid,
        info,
        dbsql
      )
      if (!switchInfoResult.success) {
        return reject({
          success: false,
          message: 'Update OldSwitchInfo failed',
          err: switchInfoResult.err
        })
      }
      dbsql.run(
        `UPDATE breaker_info SET
                    phase_trip = ?
                WHERE mrid = ?`,
        [info.phase_trip, mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update breakerInfo failed' })
          return resolve({ success: true, data: info, message: 'Update breakerInfo completed' })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update breakerInfo transaction failed' })
    }
  })
}

export const deleteBreakerInfoTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    try {
      dbsql.run(
        'DELETE FROM breaker_info WHERE mrid=?',
        [mrid],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete breakerInfo failed' })

          OldSwitchInfoFunc.deleteOldSwitchInfoTransaction(mrid, dbsql)
            .then((switchRes: any) => {
              if (!switchRes.success) {
                return reject({
                  success: false,
                  message: 'Delete OldSwitchInfo failed',
                  err: switchRes.err
                })
              }
              return resolve({ success: true, data: mrid, message: 'Delete breakerInfo completed' })
            })
            .catch((err2: Error) => {
              return reject({
                success: false,
                err: err2,
                message: 'Delete OldSwitchInfo transaction failed'
              })
            })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Delete breakerInfo transaction failed' })
    }
  })
}
