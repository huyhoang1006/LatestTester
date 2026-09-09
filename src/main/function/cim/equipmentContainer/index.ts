import db from '../../datacontext/index'
import * as connectivityNodeContainerFunc from '../connectivityNodeContainer/index'

export const insertEquipmentContainer = async (equipmentContainer: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      connectivityNodeContainerFunc
        .insertConnectivityNodeContainerTransaction(equipmentContainer, db)
        .then((result: any) => {
          if (!result.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert ConnectivityNodeContainer failed',
              err: result.err
            })
          }
          db.run(
            `INSERT INTO equipment_container(mrid)
                         VALUES (?)
                         ON CONFLICT(mrid) DO NOTHING`,
            [equipmentContainer.mrid],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert EquipmentContainer failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: equipmentContainer,
                message: 'Insert EquipmentContainer completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Insert EquipmentContainer transaction failed'
          })
        })
    })
  })
}

export const insertEquipmentContainerTransaction = async (equipmentContainer: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    connectivityNodeContainerFunc
      .insertConnectivityNodeContainerTransaction(equipmentContainer, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Insert ConnectivityNodeContainer failed',
            err: result.err
          })
        }
        dbsql.run(
          `INSERT INTO equipment_container(mrid)
                     VALUES (?)
                     ON CONFLICT(mrid) DO NOTHING`,
          [equipmentContainer.mrid],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Insert EquipmentContainer failed' })
            }
            return resolve({
              success: true,
              data: equipmentContainer,
              message: 'Insert EquipmentContainer completed'
            })
          }
        )
      })
      .catch((err: any) => {
        console.error('Insert EquipmentContainer failed:', err)
        return reject({
          success: false,
          err,
          message: 'Insert EquipmentContainer transaction failed'
        })
      })
  })
}

export const getEquipmentContainerById = async (mrid: string) => {
  try {
    const cncResult: any =
      await connectivityNodeContainerFunc.getConnectivityNodeContainerById(mrid)
    if (!cncResult.success) {
      return { success: false, data: null, message: 'ConnectivityNodeContainer not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM equipment_container WHERE mrid = ?', [mrid], (err: any, row: any) => {
        if (err)
          return reject({
            success: false,
            data: null,
            message: 'Get EquipmentContainer failed',
            err
          })
        if (!row)
          return resolve({ success: false, data: null, message: 'EquipmentContainer not found' })
        const data = { ...cncResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get EquipmentContainer completed' })
      })
    })
  } catch (err) {
    return { success: false, data: null, message: 'Get EquipmentContainer failed', err }
  }
}

export const updateEquipmentContainerById = async (mrid: string, equipmentContainer: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      connectivityNodeContainerFunc
        .updateConnectivityNodeContainerByIdTransaction(mrid, equipmentContainer, db)
        .then((result: any) => {
          if (!result.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update ConnectivityNodeContainer failed',
              err: result.err
            })
          }
          db.run(
            `UPDATE equipment_container SET mrid = ? WHERE mrid = ?`,
            [equipmentContainer.mrid, mrid],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update EquipmentContainer failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: equipmentContainer,
                message: 'Update EquipmentContainer completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Update EquipmentContainer transaction failed'
          })
        })
    })
  })
}

export const updateEquipmentContainerByIdTransaction = async (
  mrid: string,
  equipmentContainer: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    connectivityNodeContainerFunc
      .updateConnectivityNodeContainerByIdTransaction(mrid, equipmentContainer, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Update ConnectivityNodeContainer failed',
            err: result.err
          })
        }
        dbsql.run(
          `UPDATE equipment_container SET mrid = ? WHERE mrid = ?`,
          [equipmentContainer.mrid, mrid],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Update EquipmentContainer failed' })
            }
            return resolve({
              success: true,
              data: equipmentContainer,
              message: 'Update EquipmentContainer completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Update EquipmentContainer transaction failed'
        })
      })
  })
}

export const deleteEquipmentContainerById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    connectivityNodeContainerFunc
      .deleteConnectivityNodeContainerByIdTransaction(mrid, db)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete ConnectivityNodeContainer failed',
            err: result.err
          })
        }
        return resolve({
          success: true,
          message: 'Delete EquipmentContainer (and ConnectivityNodeContainer) completed'
        })
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Delete EquipmentContainer transaction failed'
        })
      })
  })
}

export const deleteEquipmentContainerByIdTransaction = async (mrid: string, dbsql: any) => {
  return connectivityNodeContainerFunc.deleteConnectivityNodeContainerByIdTransaction(mrid, dbsql)
}
