import db from '../../datacontext/index'
import * as AssetFunc from '../asset/index'

export const getJointCableInfoById = async (mrid: string) => {
  try {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM joint_cable_info WHERE mrid=?', [mrid], (err: any, row: any) => {
        if (err)
          return reject({ success: false, err, message: 'Get joint cable info by id failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'Joint cable info not found' })
        return resolve({
          success: true,
          data: row,
          message: 'Get joint cable info by id completed'
        })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get joint cable info by id failed' }
  }
}

export const getJointCableInfoByCableInfoId = async (cableInfoId: string) => {
  try {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM joint_cable_info WHERE cable_info_id=?',
        [cableInfoId],
        (err: any, row: any) => {
          if (err)
            return reject({
              success: false,
              err,
              message: 'Get joint cable info by cable info id failed'
            })
          if (!row)
            return resolve({ success: false, data: null, message: 'Joint cable info not found' })
          return resolve({
            success: true,
            data: row,
            message: 'Get joint cable info by cable info id completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get joint cable info by cable info id failed' }
  }
}

export const insertJointCableInfo = async (joint: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      AssetFunc.insertAssetTransaction(joint, db)
        .then((assetResult: any) => {
          if (!assetResult.success) {
            db.run('ROLLBACK')
            return reject({ success: false, message: 'Insert asset failed', err: assetResult.err })
          }
          db.run(
            `INSERT INTO joint_cable_info(
                            mrid, rated_u, rated_current, category, construction, service_condition, cable_info_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            rated_u = excluded.rated_u,
                            rated_current = excluded.rated_current,
                            category = excluded.category,
                            construction = excluded.construction,
                            service_condition = excluded.service_condition,
                            cable_info_id = excluded.cable_info_id
                        `,
            [
              joint.mrid,
              joint.rated_u,
              joint.rated_current,
              joint.category,
              joint.construction,
              joint.service_condition,
              joint.cable_info_id
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert joint cable info failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: joint,
                message: 'Insert joint cable info completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Insert joint cable info transaction failed'
          })
        })
    })
  })
}

export const insertJointCableInfoTransaction = async (joint: any, dbsql: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      dbsql.run(
        `INSERT INTO joint_cable_info(
                    mrid, rated_u, rated_current, category, construction, service_condition, cable_info_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    rated_u = excluded.rated_u,
                    rated_current = excluded.rated_current,
                    category = excluded.category,
                    construction = excluded.construction,
                    service_condition = excluded.service_condition,
                    cable_info_id = excluded.cable_info_id
                `,
        [
          joint.mrid,
          joint.rated_u,
          joint.rated_current,
          joint.category,
          joint.construction,
          joint.service_condition,
          joint.cable_info_id
        ],
        function (err: any) {
          if (err) {
            return reject({ success: false, err: err, message: 'Insert joint cable info failed' })
          }
          return resolve({
            success: true,
            data: joint,
            message: 'Insert joint cable info completed'
          })
        }
      )
    } catch (error) {
      return reject({
        success: false,
        err: error,
        message: 'Insert joint cable info transaction failed'
      })
    }
  })
}

export const updateJointCableInfo = async (mrid: string, joint: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      AssetFunc.updateAssetTransaction(mrid, joint, db)
        .then((assetResult: any) => {
          if (!assetResult.success) {
            db.run('ROLLBACK')
            return reject({ success: false, message: 'Update asset failed', err: assetResult.err })
          }
          db.run(
            `UPDATE joint_cable_info SET
                            rated_u = ?,
                            rated_current = ?,
                            category = ?,
                            construction = ?,
                            service_condition = ?,
                            cable_info_id = ?
                        WHERE mrid = ?`,
            [
              joint.rated_u,
              joint.rated_current,
              joint.category,
              joint.construction,
              joint.service_condition,
              joint.cable_info_id,
              mrid
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update joint cable info failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: joint,
                message: 'Update joint cable info completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Update joint cable info transaction failed'
          })
        })
    })
  })
}

export const deleteJointCableInfoById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM joint_cable_info WHERE mrid=?', [mrid], function (err: any) {
      if (err) {
        return reject({ success: false, err, message: 'Delete joint cable info failed' })
      }
      return resolve({ success: true, data: mrid, message: 'Delete joint cable info completed' })
    })
  })
}
