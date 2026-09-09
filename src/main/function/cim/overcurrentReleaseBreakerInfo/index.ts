import db from '../../datacontext/index'

export const getOvercurrentReleaseBreakerInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM overcurrent_release_breaker_info WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get overcurrentReleaseBreakerInfo by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'OvercurrentReleaseBreakerInfo not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get overcurrentReleaseBreakerInfo by id completed'
        })
      }
    )
  })
}

export const getOvercurrentReleaseBreakerInfoByAssessmentLimitId = async (
  assessmentLimitId: string
) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM overcurrent_release_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
      [assessmentLimitId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get overcurrentReleaseBreakerInfo by assessment_limit_breaker_info_id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get overcurrentReleaseBreakerInfo by assessment_limit_breaker_info_id completed'
        })
      }
    )
  })
}

export const insertOvercurrentReleaseBreakerInfoTransaction = async (
  info: {
    mrid: string
    assessment_limit_breaker_info_id: string
    parameter_name: string | null
    min: string | null
    max: string | null
    ref: string | null
    dev: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO overcurrent_release_breaker_info(
                mrid, assessment_limit_breaker_info_id, parameter_name, min, max, ref, dev
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id,
                parameter_name = excluded.parameter_name,
                min = excluded.min,
                max = excluded.max,
                ref = excluded.ref,
                dev = excluded.dev
            `,
      [
        info.mrid,
        info.assessment_limit_breaker_info_id,
        info.parameter_name,
        info.min,
        info.max,
        info.ref,
        info.dev
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Insert overcurrentReleaseBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Insert overcurrentReleaseBreakerInfo completed'
        })
      }
    )
  })
}

export const updateOvercurrentReleaseBreakerInfoTransaction = async (
  mrid: string,
  info: {
    assessment_limit_breaker_info_id: string
    parameter_name: string | null
    min: string | null
    max: string | null
    ref: string | null
    dev: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE overcurrent_release_breaker_info SET
                assessment_limit_breaker_info_id = ?,
                parameter_name = ?,
                min = ?,
                max = ?,
                ref = ?,
                dev = ?
            WHERE mrid = ?`,
      [
        info.assessment_limit_breaker_info_id,
        info.parameter_name,
        info.min,
        info.max,
        info.ref,
        info.dev,
        mrid
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update overcurrentReleaseBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Update overcurrentReleaseBreakerInfo completed'
        })
      }
    )
  })
}

export const deleteOvercurrentReleaseBreakerInfoTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM overcurrent_release_breaker_info WHERE mrid = ?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete overcurrentReleaseBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete overcurrentReleaseBreakerInfo completed'
        })
      }
    )
  })
}
