import db from '../../datacontext/index'

export const getLifecycleDateById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM lifecycle_date WHERE mrid=?',
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({ success: false, err: err, message: 'Get lifecycle date by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'LifecycleDate not found' })
        return resolve({ success: true, data: row, message: 'Get lifecycle date by id completed' })
      }
    )
  })
}

export const insertLifecycleDate = async (data: {
  mrid: string
  installation_date: string | null
  manufactured_date: string | null
  purchase_date: string | null
  received_date: string | null
  removal_date: string | null
  retired_date: string | null
}) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      db.run(
        `INSERT INTO lifecycle_date(
                    mrid, installation_date, manufactured_date, purchase_date,
                    received_date, removal_date, retired_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    installation_date = excluded.installation_date,
                    manufactured_date = excluded.manufactured_date,
                    purchase_date = excluded.purchase_date,
                    received_date = excluded.received_date,
                    removal_date = excluded.removal_date,
                    retired_date = excluded.retired_date
                `,
        [
          data.mrid,
          data.installation_date,
          data.manufactured_date,
          data.purchase_date,
          data.received_date,
          data.removal_date,
          data.retired_date
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) {
            db.run('ROLLBACK')
            return reject({ success: false, err: err, message: 'Insert lifecycle date failed' })
          }
          db.run('COMMIT')
          return resolve({ success: true, data: data, message: 'Insert lifecycle date completed' })
        }
      )
    })
  })
}

export const insertLifecycleDateTransaction = (
  data: {
    mrid: string
    installation_date: string | null
    manufactured_date: string | null
    purchase_date: string | null
    received_date: string | null
    removal_date: string | null
    retired_date: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO lifecycle_date(
                mrid, installation_date, manufactured_date, purchase_date,
                received_date, removal_date, retired_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                installation_date = excluded.installation_date,
                manufactured_date = excluded.manufactured_date,
                purchase_date = excluded.purchase_date,
                received_date = excluded.received_date,
                removal_date = excluded.removal_date,
                retired_date = excluded.retired_date
            `,
      [
        data.mrid,
        data.installation_date,
        data.manufactured_date,
        data.purchase_date,
        data.received_date,
        data.removal_date,
        data.retired_date
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err: err,
            message: 'Insert lifecycle date transaction failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Insert lifecycle date transaction completed'
        })
      }
    )
  })
}

export const updateLifecycleDate = async (
  mrid: string,
  data: {
    installation_date: string | null
    manufactured_date: string | null
    purchase_date: string | null
    received_date: string | null
    removal_date: string | null
    retired_date: string | null
  }
) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      db.run(
        `UPDATE lifecycle_date SET
                    installation_date = ?,
                    manufactured_date = ?,
                    purchase_date = ?,
                    received_date = ?,
                    removal_date = ?,
                    retired_date = ?
                WHERE mrid = ?`,
        [
          data.installation_date,
          data.manufactured_date,
          data.purchase_date,
          data.received_date,
          data.removal_date,
          data.retired_date,
          mrid
        ],
        function (this: { lastID: number; changes: number }, err: Error | null) {
          if (err) {
            db.run('ROLLBACK')
            return reject({ success: false, err: err, message: 'Update lifecycle date failed' })
          }
          db.run('COMMIT')
          return resolve({ success: true, data: data, message: 'Update lifecycle date completed' })
        }
      )
    })
  })
}

export const updateLifecycleDateTransaction = (
  mrid: string,
  data: {
    installation_date: string | null
    manufactured_date: string | null
    purchase_date: string | null
    received_date: string | null
    removal_date: string | null
    retired_date: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE lifecycle_date SET
                installation_date = ?,
                manufactured_date = ?,
                purchase_date = ?,
                received_date = ?,
                removal_date = ?,
                retired_date = ?
            WHERE mrid = ?`,
      [
        data.installation_date,
        data.manufactured_date,
        data.purchase_date,
        data.received_date,
        data.removal_date,
        data.retired_date,
        mrid
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err: err,
            message: 'Update lifecycle date transaction failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Update lifecycle date transaction completed'
        })
      }
    )
  })
}

export const deleteLifecycleDateById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM lifecycle_date WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete lifecycle date failed' })
        return resolve({ success: true, data: mrid, message: 'Delete lifecycle date completed' })
      }
    )
  })
}

export const deleteLifecycleDateByIdTransaction = async (mrid: string, dbsql: typeof db) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM lifecycle_date WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete lifecycle date failed' })
        return resolve({ success: true, data: mrid, message: 'Delete lifecycle date completed' })
      }
    )
  })
}
