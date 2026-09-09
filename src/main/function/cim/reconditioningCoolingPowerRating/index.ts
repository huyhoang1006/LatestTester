import db from '../../datacontext/index'

export const getReconditioningCoolingPowerRatingById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM reconditioning_cooling_power_rating WHERE mrid=?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get reconditioningCoolingPowerRating by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'ReconditioningCoolingPowerRating not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get reconditioningCoolingPowerRating by id completed'
        })
      }
    )
  })
}

export const insertReconditioningCoolingPowerRatingTransaction = async (
  info: { mrid: string; reconditioning_id: string; cooling_power_rating_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO reconditioning_cooling_power_rating(
                mrid, reconditioning_id, cooling_power_rating_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                reconditioning_id = excluded.reconditioning_id,
                cooling_power_rating_id = excluded.cooling_power_rating_id
            `,
      [info.mrid, info.reconditioning_id, info.cooling_power_rating_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Insert reconditioningCoolingPowerRating failed'
          })
        }
        return resolve({
          success: true,
          data: info,
          message: 'Insert reconditioningCoolingPowerRating completed'
        })
      }
    )
  })
}

export const updateReconditioningCoolingPowerRatingTransaction = async (
  mrid: string,
  info: { reconditioning_id: string; cooling_power_rating_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE reconditioning_cooling_power_rating SET
                reconditioning_id = ?,
                cooling_power_rating_id = ?
            WHERE mrid = ?`,
      [info.reconditioning_id, info.cooling_power_rating_id, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Update reconditioningCoolingPowerRating failed'
          })
        }
        return resolve({
          success: true,
          data: info,
          message: 'Update reconditioningCoolingPowerRating completed'
        })
      }
    )
  })
}

export const deleteReconditioningCoolingPowerRatingTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM reconditioning_cooling_power_rating WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Delete reconditioningCoolingPowerRating failed'
          })
        }
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete reconditioningCoolingPowerRating completed'
        })
      }
    )
  })
}
