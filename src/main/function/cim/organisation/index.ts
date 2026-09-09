import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const insertOrganisation = async (organisation: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      identifiedObjectFunc
        .insertIdentifiedObjectTransaction(organisation, db)
        .then((identifiedResult: any) => {
          if (!identifiedResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert identified object failed',
              err: identifiedResult.err
            })
          }
          db.run(
            `INSERT INTO organisation(
                            mrid,
                            electronic_address,
                            phone,
                            postal_address,
                            street_address,
                            tax_code,
                            parent_organisation
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            electronic_address = excluded.electronic_address,
                            phone = excluded.phone,
                            postal_address = excluded.postal_address,
                            street_address = excluded.street_address,
                            tax_code = excluded.tax_code,
                            parent_organisation = excluded.parent_organisation`,
            [
              organisation.mrid,
              organisation.electronic_address,
              organisation.phone,
              organisation.postal_address,
              organisation.street_address,
              organisation.tax_code,
              organisation.parent_organisation
            ],
            function (err: any) {
              if (err) {
                console.log(err)
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert organisation failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: organisation,
                message: 'Insert organisation completed'
              })
            }
          )
        })
        .catch((err: any) => {
          console.log(err)
          db.run('ROLLBACK')
          return reject({ success: false, err, message: 'Insert organisation transaction failed' })
        })
    })
  })
}

export const insertOrganisationTransaction = async (organisation: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .insertIdentifiedObjectTransaction(organisation, dbsql)
      .then((identifiedResult: any) => {
        if (!identifiedResult.success) {
          return reject({
            success: false,
            message: 'Insert identified object failed',
            err: identifiedResult.err
          })
        }
        dbsql.run(
          `INSERT INTO organisation(
                        mrid,
                        electronic_address,
                        phone,
                        postal_address,
                        street_address,
                        tax_code,
                        parent_organisation
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        electronic_address = excluded.electronic_address,
                        phone = excluded.phone,
                        postal_address = excluded.postal_address,
                        street_address = excluded.street_address,
                        tax_code = excluded.tax_code,
                        parent_organisation = excluded.parent_organisation`,
          [
            organisation.mrid,
            organisation.electronic_address,
            organisation.phone,
            organisation.postal_address,
            organisation.street_address,
            organisation.tax_code,
            organisation.parent_organisation
          ],
          function (err: any) {
            console.log(err)
            if (err) {
              return reject({ success: false, err, message: 'Insert organisation failed' })
            }
            return resolve({
              success: true,
              data: organisation,
              message: 'Insert organisation completed'
            })
          }
        )
      })
      .catch((err: any) => {
        console.log(err)
        return reject({ success: false, err, message: 'Insert organisation transaction failed' })
      })
  })
}

export const getOrganisationById = async (mrid: string) => {
  try {
    const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
    if (!identifiedResult.success) {
      return { success: false, data: null, message: 'Identified object not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM organisation WHERE mrid = ?', [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get organisation failed' })
        if (!row) return resolve({ success: false, data: null, message: 'Organisation not found' })
        const data = { ...identifiedResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get organisation completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get organisation failed' }
  }
}

export const updateOrganisationById = async (mrid: string, organisation: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      identifiedObjectFunc
        .updateIdentifiedObjectByIdTransaction(mrid, organisation, db)
        .then((identifiedResult: any) => {
          if (!identifiedResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update identified object failed',
              err: identifiedResult.err
            })
          }
          db.run(
            `UPDATE organisation SET
                            electronic_address = ?,
                            phone = ?,
                            postal_address = ?,
                            street_address = ?,
                            tax_code = ?,
                            parent_organisation = ?
                        WHERE mrid = ?`,
            [
              organisation.electronic_address,
              organisation.phone,
              organisation.postal_address,
              organisation.street_address,
              organisation.tax_code,
              organisation.parent_organisation,
              mrid
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update organisation failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: organisation,
                message: 'Update organisation completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({ success: false, err, message: 'Update organisation transaction failed' })
        })
    })
  })
}

export const updateOrganisationByIdTransaction = async (
  mrid: string,
  organisation: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .updateIdentifiedObjectByIdTransaction(mrid, organisation, dbsql)
      .then((identifiedResult: any) => {
        if (!identifiedResult.success) {
          return reject({
            success: false,
            message: 'Update identified object failed',
            err: identifiedResult.err
          })
        }
        dbsql.run(
          `UPDATE organisation SET
                        electronic_address = ?,
                        phone = ?,
                        postal_address = ?,
                        street_address = ?,
                        tax_code = ?,
                        parent_organisation = ?
                    WHERE mrid = ?`,
          [
            organisation.electronic_address,
            organisation.phone,
            organisation.postal_address,
            organisation.street_address,
            organisation.tax_code,
            organisation.parent_organisation,
            mrid
          ],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Update organisation failed' })
            }
            return resolve({
              success: true,
              data: organisation,
              message: 'Update organisation completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Update organisation transaction failed' })
      })
  })
}

export const deleteOrganisationById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .deleteIdentifiedObjectByIdTransaction(mrid, db)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete identified object failed',
            err: result.err
          })
        }
        return resolve({
          success: true,
          message: 'Delete organisation (and identified object) completed'
        })
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Delete organisation transaction failed' })
      })
  })
}

export const deleteOrganisationByIdTransaction = async (mrid: string, dbsql: any) => {
  return identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
}
