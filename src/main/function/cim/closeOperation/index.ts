import db from '../../datacontext/index'

export const getCloseOperationById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM close_operation WHERE mrid = ?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err) return reject({ success: false, err, message: 'Get closeOperation by id failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'CloseOperation not found' })
        return resolve({ success: true, data: row, message: 'Get closeOperation by id completed' })
      }
    )
  })
}

export const getCloseOperationByAuxiliaryContactsId = async (auxId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM close_operation WHERE auxiliary_contacts_breaker_info_id = ?`,
      [auxId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get closeOperation by auxiliary id failed'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get closeOperation by auxiliary id completed'
        })
      }
    )
  })
}

export const insertCloseOperationTransaction = async (
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
      `INSERT INTO close_operation(
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
        if (err) return reject({ success: false, err, message: 'Insert closeOperation failed' })
        return resolve({ success: true, data: info, message: 'Insert closeOperation completed' })
      }
    )
  })
}

export const updateCloseOperationTransaction = async (
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
      `UPDATE close_operation SET
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
        if (err) return reject({ success: false, err, message: 'Update closeOperation failed' })
        return resolve({ success: true, data: info, message: 'Update closeOperation completed' })
      }
    )
  })
}

export const deleteCloseOperationTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM close_operation WHERE mrid = ?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete closeOperation failed' })
        return resolve({ success: true, data: mrid, message: 'Delete closeOperation completed' })
      }
    )
  })
}
