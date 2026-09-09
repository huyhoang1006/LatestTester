import db from '../../datacontext/index'

export const getDissipationFactorCapacitorInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM dissipation_factor_capacitor_info WHERE mrid=?',
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get dissipationFactorCapacitorInfo by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'DissipationFactorCapacitorInfo not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get dissipationFactorCapacitorInfo by id completed'
        })
      }
    )
  })
}

export const getDissipationFactorCapacitorInfoByIds = async (capacitorInfoIds: string[]) => {
  return new Promise((resolve, reject) => {
    if (!capacitorInfoIds || capacitorInfoIds.length === 0) {
      return resolve({ success: false, data: [], message: 'No capacitor_info_ids provided' })
    }

    const placeholders = capacitorInfoIds.map(() => '?').join(',')

    db.all(
      `SELECT * FROM dissipation_factor_capacitor_info WHERE capacitor_info_id IN (${placeholders})`,
      capacitorInfoIds,
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err: err,
            message: 'Get dissipationFactorCapacitorInfo by ids failed'
          })
        if (!rows || rows.length === 0)
          return resolve({
            success: false,
            data: [],
            message: 'DissipationFactorCapacitorInfo not found'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get dissipationFactorCapacitorInfo by ids completed'
        })
      }
    )
  })
}

export const insertDissipationFactorCapacitorInfoTransaction = async (
  dissipationFactorCapacitorInfo: {
    mrid: string
    phase: string | null
    value: number | null
    capacitor_info_id: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO dissipation_factor_capacitor_info(mrid, phase, value, capacitor_info_id)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                phase = excluded.phase,
                value = excluded.value,
                capacitor_info_id = excluded.capacitor_info_id`,
      [
        dissipationFactorCapacitorInfo.mrid,
        dissipationFactorCapacitorInfo.phase,
        dissipationFactorCapacitorInfo.value,
        dissipationFactorCapacitorInfo.capacitor_info_id
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Insert dissipationFactorCapacitorInfo failed'
          })
        return resolve({
          success: true,
          data: dissipationFactorCapacitorInfo,
          message: 'Insert dissipationFactorCapacitorInfo completed'
        })
      }
    )
  })
}

export const updateDissipationFactorCapacitorInfoTransaction = async (
  mrid: string,
  dissipationFactorCapacitorInfo: {
    phase: string | null
    value: number | null
    capacitor_info_id: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE dissipation_factor_capacitor_info SET
                phase = ?,
                value = ?,
                capacitor_info_id = ?
             WHERE mrid = ?`,
      [
        dissipationFactorCapacitorInfo.phase,
        dissipationFactorCapacitorInfo.value,
        dissipationFactorCapacitorInfo.capacitor_info_id,
        mrid
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update dissipationFactorCapacitorInfo failed'
          })
        return resolve({
          success: true,
          data: dissipationFactorCapacitorInfo,
          message: 'Update dissipationFactorCapacitorInfo completed'
        })
      }
    )
  })
}

export const deleteDissipationFactorCapacitorInfoTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM dissipation_factor_capacitor_info WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete dissipationFactorCapacitorInfo failed'
          })
        if (this.changes === 0)
          return resolve({
            success: false,
            data: null,
            message: 'DissipationFactorCapacitorInfo not found'
          })
        return resolve({
          success: true,
          data: null,
          message: 'Delete dissipationFactorCapacitorInfo completed'
        })
      }
    )
  })
}

export const deleteDissipationFactorCapacitorInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM dissipation_factor_capacitor_info WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete dissipationFactorCapacitorInfo failed'
          })
        if (this.changes === 0)
          return resolve({
            success: false,
            data: null,
            message: 'DissipationFactorCapacitorInfo not found'
          })
        return resolve({
          success: true,
          data: null,
          message: 'Delete dissipationFactorCapacitorInfo completed'
        })
      }
    )
  })
}
