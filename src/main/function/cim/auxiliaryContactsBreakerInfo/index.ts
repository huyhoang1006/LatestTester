import db from '../../datacontext/index'

export const getAuxiliaryContactsBreakerInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM auxiliary_contacts_breaker_info WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get auxiliaryContactsBreakerInfo by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'AuxiliaryContactsBreakerInfo not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get auxiliaryContactsBreakerInfo by id completed'
        })
      }
    )
  })
}

export const getAuxiliaryContactsBreakerInfoByAssessmentLimitId = async (
  assessmentLimitId: string
) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM auxiliary_contacts_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
      [assessmentLimitId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get auxiliaryContactsBreakerInfo by assessment_limit_breaker_info_id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get auxiliaryContactsBreakerInfo by assessment_limit_breaker_info_id completed'
        })
      }
    )
  })
}

export const insertAuxiliaryContactsBreakerInfoTransaction = async (
  info: { mrid: string; assessment_limit_breaker_info_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO auxiliary_contacts_breaker_info(
                mrid, assessment_limit_breaker_info_id
            ) VALUES (?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id
            `,
      [info.mrid, info.assessment_limit_breaker_info_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Insert auxiliaryContactsBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Insert auxiliaryContactsBreakerInfo completed'
        })
      }
    )
  })
}

export const updateAuxiliaryContactsBreakerInfoTransaction = async (
  mrid: string,
  info: { assessment_limit_breaker_info_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE auxiliary_contacts_breaker_info SET
                assessment_limit_breaker_info_id = ?
            WHERE mrid = ?`,
      [info.assessment_limit_breaker_info_id, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update auxiliaryContactsBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: info,
          message: 'Update auxiliaryContactsBreakerInfo completed'
        })
      }
    )
  })
}

export const deleteAuxiliaryContactsBreakerInfoTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM auxiliary_contacts_breaker_info WHERE mrid = ?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete auxiliaryContactsBreakerInfo failed'
          })
        return resolve({
          success: true,
          data: mrid,
          message: 'Delete auxiliaryContactsBreakerInfo completed'
        })
      }
    )
  })
}
