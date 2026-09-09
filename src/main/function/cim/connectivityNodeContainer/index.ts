import db from '../../datacontext/index'
import * as powerSystemResourceFunc from '../powerSystemResource/index'

export const insertConnectivityNodeContainer = async (cnc: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      powerSystemResourceFunc
        .insertPowerSystemResourceTransaction(cnc, db)
        .then((result: any) => {
          if (!result.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert PowerSystemResource failed',
              err: result.err
            })
          }
          db.run(
            `INSERT INTO connectivity_node_container(mrid)
                         VALUES (?)
                         ON CONFLICT(mrid) DO NOTHING`,
            [cnc.mrid],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({
                  success: false,
                  err,
                  message: 'Insert ConnectivityNodeContainer failed'
                })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: cnc,
                message: 'Insert ConnectivityNodeContainer completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Insert ConnectivityNodeContainer transaction failed'
          })
        })
    })
  })
}

export const insertConnectivityNodeContainerTransaction = async (cnc: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    powerSystemResourceFunc
      .insertPowerSystemResourceTransaction(cnc, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Insert PowerSystemResource failed',
            err: result.err
          })
        }
        dbsql.run(
          `INSERT INTO connectivity_node_container(mrid)
                     VALUES (?)
                     ON CONFLICT(mrid) DO NOTHING`,
          [cnc.mrid],
          function (err: any) {
            if (err) {
              return reject({
                success: false,
                err,
                message: 'Insert ConnectivityNodeContainer failed'
              })
            }
            return resolve({
              success: true,
              data: cnc,
              message: 'Insert ConnectivityNodeContainer completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Insert ConnectivityNodeContainer transaction failed'
        })
      })
  })
}

export const getConnectivityNodeContainerById = async (mrid: string) => {
  try {
    const psrResult: any = await powerSystemResourceFunc.getPowerSystemResourceById(mrid)
    if (!psrResult.success) {
      return { success: false, data: null, message: 'PowerSystemResource not found' }
    }
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM connectivity_node_container WHERE mrid = ?',
        [mrid],
        (err: any, row: any) => {
          if (err)
            return reject({ success: false, err, message: 'Get ConnectivityNodeContainer failed' })
          if (!row)
            return resolve({
              success: false,
              data: null,
              message: 'ConnectivityNodeContainer not found'
            })
          const data = { ...psrResult.data, ...row }
          return resolve({
            success: true,
            data: data,
            message: 'Get ConnectivityNodeContainer completed'
          })
        }
      )
    })
  } catch (err) {
    return { success: false, err, message: 'Get ConnectivityNodeContainer failed' }
  }
}

export const deleteConnectivityNodeContainerById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    powerSystemResourceFunc
      .deletePowerSystemResourceByIdTransaction(mrid, db)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete PowerSystemResource failed',
            err: result.err
          })
        }
        return resolve({
          success: true,
          message: 'Delete ConnectivityNodeContainer (and PowerSystemResource) completed'
        })
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Delete ConnectivityNodeContainer transaction failed'
        })
      })
  })
}

export const deleteConnectivityNodeContainerByIdTransaction = async (mrid: string, dbsql: any) => {
  return powerSystemResourceFunc.deletePowerSystemResourceByIdTransaction(mrid, dbsql)
}

export const updateConnectivityNodeContainerById = async (mrid: string, cnc: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      powerSystemResourceFunc
        .updatePowerSystemResourceTransaction(mrid, cnc, db)
        .then((result: any) => {
          if (!result.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update PowerSystemResource failed',
              err: result.err
            })
          }
          db.run(
            `UPDATE connectivity_node_container SET mrid = ? WHERE mrid = ?`,
            [cnc.mrid, mrid],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({
                  success: false,
                  err,
                  message: 'Update ConnectivityNodeContainer failed'
                })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: cnc,
                message: 'Update ConnectivityNodeContainer completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Update ConnectivityNodeContainer transaction failed'
          })
        })
    })
  })
}

export const updateConnectivityNodeContainerByIdTransaction = async (
  mrid: string,
  cnc: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    powerSystemResourceFunc
      .updatePowerSystemResourceTransaction(mrid, cnc, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Update PowerSystemResource failed',
            err: result.err
          })
        }
        dbsql.run(
          `UPDATE connectivity_node_container SET mrid = ? WHERE mrid = ?`,
          [cnc.mrid, mrid],
          function (err: any) {
            if (err) {
              return reject({
                success: false,
                err,
                message: 'Update ConnectivityNodeContainer failed'
              })
            }
            return resolve({
              success: true,
              data: cnc,
              message: 'Update ConnectivityNodeContainer completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Update ConnectivityNodeContainer transaction failed'
        })
      })
  })
}
