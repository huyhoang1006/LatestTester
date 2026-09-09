import db from '../../datacontext/index'

export const getUnderVoltageReleaseBreakerInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM under_voltage_release_breaker_info WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get underVoltageReleaseBreakerInfo by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'UnderVoltageReleaseBreakerInfo not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get underVoltageReleaseBreakerInfo by id completed'
        })
      }
    )
  })
}

export const getUnderVoltageReleaseBreakerInfoByAssessmentLimitId = async (
  assessmentLimitId: string
) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM under_voltage_release_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
      [assessmentLimitId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get underVoltageReleaseBreakerInfo by assessment_limit_breaker_info_id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message:
            'Get underVoltageReleaseBreakerInfo by assessment_limit_breaker_info_id completed'
        })
      }
    )
  })
}

export const insertUnderVoltageReleaseBreakerInfoTransaction = async (
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
      `INSERT INTO under_voltage_release_breaker_info(
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
            message: 'Insert underVoltageReleaseBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Insert underVoltageReleaseBreakerInfo completed'
        })
      }
    )
  })
}

export const updateUnderVoltageReleaseBreakerInfoTransaction = async (
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
      `UPDATE under_voltage_release_breaker_info SET
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
            message: 'Update underVoltageReleaseBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Update underVoltageReleaseBreakerInfo completed'
        })
      }
    )
  })
}

export const deleteUnderVoltageReleaseBreakerInfoTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM under_voltage_release_breaker_info WHERE mrid = ?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete underVoltageReleaseBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete underVoltageReleaseBreakerInfo completed'
        })
      }
    )
  })
}
