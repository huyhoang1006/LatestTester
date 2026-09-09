import db from '../../datacontext/index'

export const getTripOperationById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM trip_operation WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err) return reject({ success: false, err, message: 'Get tripOperation by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'TripOperation not found' })
        return resolve({ success: true, data: row, message: 'Get tripOperation by id completed' })
      }
    )
  })
}

export const getTripOperationByAuxiliaryContactsId = async (auxId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM trip_operation WHERE auxiliary_contacts_breaker_info_id = ?`,
      [auxId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get tripOperation by auxiliary id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get tripOperation by auxiliary id completed'
        })
      }
    )
  })
}

export const insertTripOperationTransaction = async (
  info: {
    mrid: string
    auxiliary_contacts_breaker_info_id: string
    parameter_name: string | null
    t_min: string | null
    t_max: string | null
    t_ref: string | null
    t_dev: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO trip_operation(
                mrid, auxiliary_contacts_breaker_info_id, parameter_name,
                t_min, t_max, t_ref, t_dev
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                auxiliary_contacts_breaker_info_id = excluded.auxiliary_contacts_breaker_info_id,
                parameter_name = excluded.parameter_name,
                t_min = excluded.t_min,
                t_max = excluded.t_max,
                t_ref = excluded.t_ref,
                t_dev = excluded.t_dev
            `,
      [
        info.mrid,
        info.auxiliary_contacts_breaker_info_id,
        info.parameter_name,
        info.t_min,
        info.t_max,
        info.t_ref,
        info.t_dev
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert tripOperation failed' })
        return resolve({ success: true, data: info, message: 'Insert tripOperation completed' })
      }
    )
  })
}

export const updateTripOperationTransaction = async (
  mrid: string,
  info: {
    auxiliary_contacts_breaker_info_id: string
    parameter_name: string | null
    t_min: string | null
    t_max: string | null
    t_ref: string | null
    t_dev: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE trip_operation SET
                auxiliary_contacts_breaker_info_id = ?,
                parameter_name = ?,
                t_min = ?,
                t_max = ?,
                t_ref = ?,
                t_dev = ?
            WHERE mrid = ?`,
      [
        info.auxiliary_contacts_breaker_info_id,
        info.parameter_name,
        info.t_min,
        info.t_max,
        info.t_ref,
        info.t_dev,
        mrid
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update tripOperation failed' })
        return resolve({ success: true, data: info, message: 'Update tripOperation completed' })
      }
    )
  })
}

export const deleteTripOperationTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM trip_operation WHERE mrid = ?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete tripOperation failed' })
        return resolve({ success: true, data: mrid, message: 'Delete tripOperation completed' })
      }
    )
  })
}
