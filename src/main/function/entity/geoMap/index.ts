import db from '../../datacontext/index'

export const getGeoMapById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM geo_map WHERE mrid=?', [mrid], (err: any, row: any) => {
      if (err) return reject({ success: false, err: err, message: 'Get geo map by id failed' })
      if (!row) return resolve({ success: false, data: null, message: 'Geo map not found' })
      return resolve({ success: true, data: row, message: 'Get geo map by id completed' })
    })
  })
}

export const getGeoMapByOrganisationId = async (organisationId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM geo_map WHERE organisation_id=?',
      [organisationId],
      (err: any, rows: any) => {
        if (err)
          return reject({
            success: false,
            err: err,
            message: 'Get geo map by organisation id failed'
          })
        if (!rows || rows.length === 0)
          return resolve({ success: false, data: null, message: 'Geo map not found' })
        return resolve({
          success: true,
          data: rows,
          message: 'Get geo map by organisation id completed'
        })
      }
    )
  })
}

export const insertGeoMap = async (geoMap: any) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO geo_map(mrid, organisation_id, x, y, z)
             VALUES (?, ?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                organisation_id = excluded.organisation_id,
                x = excluded.x,
                y = excluded.y,
                z = excluded.z`,
      [geoMap.mrid, geoMap.organisation_id, geoMap.x, geoMap.y, geoMap.z],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Insert geo map failed' })
        return resolve({ success: true, data: geoMap, message: 'Insert geo map completed' })
      }
    )
  })
}

export const insertGeoMapArray = async (geoMaps: any[]) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(geoMaps) || geoMaps.length === 0) {
      return reject({ success: false, message: 'Geo maps array is empty or invalid' })
    }

    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err: any) => {
        if (err) return reject({ success: false, err, message: 'Failed to begin transaction' })
      })

      let completedCount = 0
      let hasError = false
      const errors: any[] = []

      geoMaps.forEach((geoMap, index) => {
        if (hasError) return

        db.run(
          `INSERT INTO geo_map(mrid, organisation_id, x, y, z)
                     VALUES (?, ?, ?, ?, ?)
                     ON CONFLICT(mrid) DO UPDATE SET
                        organisation_id = excluded.organisation_id,
                        x = excluded.x,
                        y = excluded.y,
                        z = excluded.z`,
          [geoMap.mrid, geoMap.organisation_id, geoMap.x, geoMap.y, geoMap.z],
          function (err: any) {
            if (err) {
              hasError = true
              errors.push({ index, error: err, mrid: geoMap.mrid })
              db.run('ROLLBACK', () => {
                return reject({
                  success: false,
                  err: errors,
                  message: `Insert geo map array failed at index ${index}`
                })
              })
              return
            }

            completedCount++
            if (completedCount === geoMaps.length) {
              db.run('COMMIT', (err: any) => {
                if (err) {
                  return reject({ success: false, err, message: 'Failed to commit transaction' })
                }
                return resolve({
                  success: true,
                  data: geoMaps,
                  message: `Insert ${geoMaps.length} geo maps completed`
                })
              })
            }
          }
        )
      })
    })
  })
}

export const insertGeoMapTransaction = async (geoMap: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO geo_map(mrid, organisation_id, x, y, z)
             VALUES (?, ?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                organisation_id = excluded.organisation_id,
                x = excluded.x,
                y = excluded.y,
                z = excluded.z`,
      [geoMap.mrid, geoMap.organisation_id, geoMap.x, geoMap.y, geoMap.z],
      function (err: any) {
        if (err)
          return reject({ success: false, err, message: 'Insert geo map transaction failed' })
        return resolve({
          success: true,
          data: geoMap,
          message: 'Insert geo map transaction completed'
        })
      }
    )
  })
}

export const updateGeoMapById = async (mrid: string, geoMap: any) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE geo_map
             SET organisation_id = ?, x = ?, y = ?, z = ?
             WHERE mrid = ?`,
      [geoMap.organisation_id, geoMap.x, geoMap.y, geoMap.z, mrid],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Update geo map failed' })
        return resolve({ success: true, data: geoMap, message: 'Update geo map completed' })
      }
    )
  })
}

export const updateGeoMapByIdTransaction = async (mrid: string, geoMap: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE geo_map
             SET organisation_id = ?, x = ?, y = ?, z = ?
             WHERE mrid = ?`,
      [geoMap.organisation_id, geoMap.x, geoMap.y, geoMap.z, mrid],
      function (err: any) {
        if (err)
          return reject({ success: false, err, message: 'Update geo map transaction failed' })
        return resolve({
          success: true,
          data: geoMap,
          message: 'Update geo map transaction completed'
        })
      }
    )
  })
}

export const deleteGeoMapById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM geo_map WHERE mrid=?', [mrid], function (err: any) {
      if (err) return reject({ success: false, err, message: 'Delete geo map failed' })
      return resolve({ success: true, data: mrid, message: 'Delete geo map completed' })
    })
  })
}

export const deleteGeoMapByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run('DELETE FROM geo_map WHERE mrid=?', [mrid], function (err: any) {
      if (err) return reject({ success: false, err, message: 'Delete geo map transaction failed' })
      return resolve({ success: true, data: mrid, message: 'Delete geo map transaction completed' })
    })
  })
}
