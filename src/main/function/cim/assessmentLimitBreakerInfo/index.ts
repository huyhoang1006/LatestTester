import db from '../../datacontext/index'

export const getAssessmentLimitBreakerInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM assessment_limit_breaker_info WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get assessmentLimitBreakerInfo by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'AssessmentLimitBreakerInfo not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get assessmentLimitBreakerInfo by id completed'
        })
      }
    )
  })
}

export const getAssessmentLimitBreakerInfoByBreakerInfoId = async (breakerInfoId: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM assessment_limit_breaker_info WHERE breaker_info_id = ?`,
      [breakerInfoId],
      (err: Error | null, rows: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get assessmentLimitBreakerInfo by old_breaker_info_id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get assessmentLimitBreakerInfo by old_breaker_info_id completed'
        })
      }
    )
  })
}

export const insertAssessmentLimitBreakerInfoTransaction = async (
  info: { mrid: string; breaker_info_id: string; limit_type: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO assessment_limit_breaker_info(
                mrid, breaker_info_id, limit_type
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                breaker_info_id = excluded.breaker_info_id,
                limit_type = excluded.limit_type
            `,
      [info.mrid, info.breaker_info_id, info.limit_type],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Insert assessmentLimitBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Insert assessmentLimitBreakerInfo completed'
        })
      }
    )
  })
}

export const updateAssessmentLimitBreakerInfoTransaction = async (
  mrid: string,
  info: { breaker_info_id: string; limit_type: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE assessment_limit_breaker_info SET
                breaker_info_id = ?,
                limit_type = ?
            WHERE mrid = ?`,
      [info.breaker_info_id, info.limit_type, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update assessmentLimitBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Update assessmentLimitBreakerInfo completed'
        })
      }
    )
  })
}

export const deleteAssessmentLimitBreakerInfoTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `DELETE FROM assessment_limit_breaker_info WHERE mrid = ?`,
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete assessmentLimitBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete assessmentLimitBreakerInfo completed'
        })
      }
    )
  })
}
