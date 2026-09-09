import db from '../../datacontext/index'

export const getCoilCharacteristicsBreakerInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM coil_characteristics_breaker_info WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get coilCharacteristicsBreakerInfo by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'CoilCharacteristicsBreakerInfo not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get coilCharacteristicsBreakerInfo by id completed'
        })
      }
    )
  })
}

export const getCoilCharacteristicsBreakerInfoByAssessmentLimitId = async (
  assessmentLimitId: string
) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM coil_characteristics_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
      [assessmentLimitId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get coilCharacteristicsBreakerInfo by assessment_limit_breaker_info_id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message:
            'Get coilCharacteristicsBreakerInfo by assessment_limit_breaker_info_id completed'
        })
      }
    )
  })
}

export const insertCoilCharacteristicsBreakerInfoTransaction = async (
  info: {
    mrid: string
    assessment_limit_breaker_info_id: string
    parameter_name: string | null
    min: string | null
    max: string | null
    ref: string | null
    dev_negative: string | null
    dev_positive: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO coil_characteristics_breaker_info(
                mrid, assessment_limit_breaker_info_id, parameter_name, min, max, ref, dev_negative, dev_positive
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id,
                parameter_name = excluded.parameter_name,
                min = excluded.min,
                max = excluded.max,
                ref = excluded.ref,
                dev_negative = excluded.dev_negative,
                dev_positive = excluded.dev_positive
            `,
      [
        info.mrid,
        info.assessment_limit_breaker_info_id,
        info.parameter_name,
        info.min,
        info.max,
        info.ref,
        info.dev_negative,
        info.dev_positive
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Insert coilCharacteristicsBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Insert coilCharacteristicsBreakerInfo completed'
        })
      }
    )
  })
}

export const updateCoilCharacteristicsBreakerInfoTransaction = async (
  mrid: string,
  info: {
    assessment_limit_breaker_info_id: string
    parameter_name: string | null
    min: string | null
    max: string | null
    ref: string | null
    dev_negative: string | null
    dev_positive: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE coil_characteristics_breaker_info SET
                assessment_limit_breaker_info_id = ?,
                parameter_name = ?,
                min = ?,
                max = ?,
                ref = ?,
                dev_negative = ?,
                dev_positive = ?
            WHERE mrid = ?`,
      [
        info.assessment_limit_breaker_info_id,
        info.parameter_name,
        info.min,
        info.max,
        info.ref,
        info.dev_negative,
        info.dev_positive,
        mrid
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update coilCharacteristicsBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Update coilCharacteristicsBreakerInfo completed'
        })
      }
    )
  })
}

export const deleteCoilCharacteristicsBreakerInfoTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM coil_characteristics_breaker_info WHERE mrid = ?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete coilCharacteristicsBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete coilCharacteristicsBreakerInfo completed'
        })
      }
    )
  })
}
