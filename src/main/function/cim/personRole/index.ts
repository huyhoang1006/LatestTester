import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const insertPersonRole = async (personRole: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      identifiedObjectFunc
        .insertIdentifiedObjectTransaction(personRole, db)
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
            `INSERT INTO person_role(
                            mrid,
                            department,
                            position,
                            person
                        ) VALUES (?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            department = excluded.department,
                            position = excluded.position,
                            person = excluded.person`,
            [personRole.mrid, personRole.department, personRole.position, personRole.person],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert personRole failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: personRole,
                message: 'Insert personRole completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({ success: false, err, message: 'Insert personRole transaction failed' })
        })
    })
  })
}

export const insertPersonRoleTransaction = async (personRole: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .insertIdentifiedObjectTransaction(personRole, dbsql)
      .then((identifiedResult: any) => {
        if (!identifiedResult.success) {
          return reject({
            success: false,
            message: 'Insert identified object failed',
            err: identifiedResult.err
          })
        }
        dbsql.run(
          `INSERT INTO person_role(
                        mrid,
                        person,
                        department,
                        position
                    ) VALUES (?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        person = excluded.person,
                        department = excluded.department,
                        position = excluded.position`,
          [personRole.mrid, personRole.person, personRole.department, personRole.position],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Insert personRole failed' })
            }
            return resolve({
              success: true,
              data: personRole,
              message: 'Insert personRole completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Insert personRole transaction failed' })
      })
  })
}

export const getPersonRoleById = async (mrid: string) => {
  try {
    const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
    if (!identifiedResult.success) {
      return { success: false, data: null, message: 'Identified object not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM person_role WHERE mrid = ?', [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get personRole failed' })
        if (!row) return resolve({ success: false, data: null, message: 'PersonRole not found' })
        const data = { ...identifiedResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get personRole completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get personRole failed' }
  }
}

export const getPersonRoleByPersonId = async (personId: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM person_role WHERE person = ?', [personId], async (err: any, row: any) => {
      if (err) return reject({ success: false, err, message: 'Get personRole failed' })
      if (!row) return resolve({ success: false, data: null, message: 'PersonRole not found' })
      try {
        const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(row.mrid)
        if (!identifiedResult.success) {
          return resolve({ success: false, data: null, message: 'Identified object not found' })
        }
        const data = { ...identifiedResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get personRole completed' })
      } catch (e) {
        return reject({ success: false, err: e, message: 'Get identified object failed' })
      }
    })
  })
}

export const updatePersonRole = async (mrid: string, personRole: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      identifiedObjectFunc
        .updateIdentifiedObjectByIdTransaction(mrid, personRole, db)
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
            `UPDATE person_role SET
                            department = ?,
                            position = ?,
                            person = ?
                        WHERE mrid = ?`,
            [personRole.department, personRole.position, personRole.person, mrid],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update personRole failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: personRole,
                message: 'Update personRole completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({ success: false, err, message: 'Update personRole transaction failed' })
        })
    })
  })
}

export const updatePersonRoleTransaction = async (mrid: string, personRole: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    identifiedObjectFunc
      .updateIdentifiedObjectByIdTransaction(mrid, personRole, dbsql)
      .then((identifiedResult: any) => {
        if (!identifiedResult.success) {
          return reject({
            success: false,
            message: 'Update identified object failed',
            err: identifiedResult.err
          })
        }
        dbsql.run(
          `UPDATE person_role SET
                        department = ?,
                        position = ?,
                        person = ?
                    WHERE mrid = ?`,
          [personRole.department, personRole.position, personRole.person, mrid],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Update personRole failed' })
            }
            return resolve({
              success: true,
              data: personRole,
              message: 'Update personRole completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Update personRole transaction failed' })
      })
  })
}

export const deletePersonRoleById = async (mrid: string) => {
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
          message: 'Delete personRole (and identified object) completed'
        })
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Delete personRole transaction failed' })
      })
  })
}

export const deletePersonRoleByIdTransaction = async (mrid: string, dbsql: any) => {
  return identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
}
