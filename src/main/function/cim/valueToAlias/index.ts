import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const getValueToAliasById = async (mrid: string) => {
  try {
    const identifiedObject: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
    if (!identifiedObject.success) {
      return { success: false, data: null, message: 'IdentifiedObject not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM value_to_alias WHERE mrid=?`, [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get valueToAlias by id failed' })
        if (!row) return resolve({ success: false, data: null, message: 'ValueToAlias not found' })
        return resolve({
          success: true,
          data: { ...identifiedObject.data, ...row },
          message: 'Get valueToAlias by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get valueToAlias by id failed' }
  }
}

export const getValueToAliasByValueAliasSetId = async (valueAliasSetId: string) => {
  try {
    return new Promise((resolve, reject) => {
      const sql = `
                SELECT vta.*, io.*
                FROM value_to_alias vta
                LEFT JOIN identified_object io ON vta.mrid = io.mrid
                WHERE vta.value_alias_set = ?
            `

      db.all(sql, [valueAliasSetId], (err: any, rows: any) => {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Get valueToAlias by valueAliasSetId failed'
          })
        }
        if (!rows || rows.length === 0) {
          return resolve({ success: false, data: [], message: 'No ValueToAlias found' })
        }

        return resolve({
          success: true,
          data: rows,
          message: 'Get valueToAlias by valueAliasSetId completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get valueToAlias by valueAliasSetId failed' }
  }
}

export const insertValueToAliasTransaction = async (valueToAlias: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idObjResult: any = await identifiedObjectFunc.insertIdentifiedObjectTransaction(
        valueToAlias,
        dbsql
      )
      if (!idObjResult.success) {
        return reject({
          success: false,
          message: 'Insert identifiedObject failed',
          err: idObjResult.err
        })
      }
      dbsql.run(
        `INSERT INTO value_to_alias(
                    mrid, value, value_alias_set
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    value = excluded.value,
                    value_alias_set = excluded.value_alias_set
                `,
        [valueToAlias.mrid, valueToAlias.value, valueToAlias.value_alias_set],
        function (err: any) {
          if (err) return reject({ success: false, err, message: 'Insert valueToAlias failed' })
          return resolve({
            success: true,
            data: valueToAlias,
            message: 'Insert valueToAlias completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Insert valueToAlias failed' })
    }
  })
}

export const updateValueToAliasByIdTransaction = async (
  mrid: string,
  valueToAlias: any,
  dbsql: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idObjResult: any = await identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(
        mrid,
        valueToAlias,
        dbsql
      )
      if (!idObjResult.success) {
        return reject({
          success: false,
          message: 'Update identifiedObject failed',
          err: idObjResult.err
        })
      }
      dbsql.run(
        `UPDATE value_to_alias SET
                    value = ?,
                    value_alias_set = ?
                WHERE mrid = ?`,
        [valueToAlias.value, valueToAlias.value_alias_set, mrid],
        function (err: any) {
          if (err) return reject({ success: false, err, message: 'Update valueToAlias failed' })
          return resolve({
            success: true,
            data: valueToAlias,
            message: 'Update valueToAlias completed'
          })
        }
      )
    } catch (err) {
      return reject({ success: false, err, message: 'Update valueToAlias failed' })
    }
  })
}

export const deleteValueToAliasByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run('DELETE FROM value_to_alias WHERE mrid=?', [mrid], function (this: any, err: any) {
        if (err) return reject({ success: false, err, message: 'Delete valueToAlias failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'ValueToAlias not found' })
        identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
        return resolve({ success: true, data: null, message: 'Delete valueToAlias completed' })
      })
    } catch (err) {
      return reject({ success: false, err, message: 'Delete valueToAlias failed' })
    }
  })
}
