import db from '../../datacontext/index'
import * as equipmentContainerFunc from '../equipmentContainer/index'

export const insertBay = async (bay: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      equipmentContainerFunc
        .insertEquipmentContainerTransaction(bay, db)
        .then((result: any) => {
          if (!result.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert EquipmentContainer failed',
              err: result.err
            })
          }
          db.run(
            `INSERT INTO bay(mrid, bay_energy_meas_flag, bay_power_meas_flag, breaker_configuration, bus_bar_configuration, substation, voltage_level)
                         VALUES (?, ?, ?, ?, ?, ?, ?)
                         ON CONFLICT(mrid) DO UPDATE SET
                            bay_energy_meas_flag = excluded.bay_energy_meas_flag,
                            bay_power_meas_flag = excluded.bay_power_meas_flag,
                            breaker_configuration = excluded.breaker_configuration,
                            bus_bar_configuration = excluded.bus_bar_configuration,
                            substation = excluded.substation,
                            voltage_level = excluded.voltage_level`,
            [
              bay.mrid,
              bay.bay_energy_meas_flag,
              bay.bay_power_meas_flag,
              bay.breaker_configuration,
              bay.bus_bar_configuration,
              bay.substation,
              bay.voltage_level
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert Bay failed' })
              }
              db.run('COMMIT')
              return resolve({ success: true, data: bay, message: 'Insert Bay completed' })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({ success: false, err, message: 'Insert Bay transaction failed' })
        })
    })
  })
}

export const insertBayTransaction = async (bay: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    equipmentContainerFunc
      .insertEquipmentContainerTransaction(bay, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Insert EquipmentContainer failed',
            err: result.err
          })
        }
        dbsql.run(
          `INSERT INTO bay(mrid, bay_energy_meas_flag, bay_power_meas_flag, breaker_configuration, bus_bar_configuration, substation, voltage_level)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON CONFLICT(mrid) DO UPDATE SET
                        bay_energy_meas_flag = excluded.bay_energy_meas_flag,
                        bay_power_meas_flag = excluded.bay_power_meas_flag,
                        breaker_configuration = excluded.breaker_configuration,
                        bus_bar_configuration = excluded.bus_bar_configuration,
                        substation = excluded.substation,
                        voltage_level = excluded.voltage_level`,
          [
            bay.mrid,
            bay.bay_energy_meas_flag,
            bay.bay_power_meas_flag,
            bay.breaker_configuration,
            bay.bus_bar_configuration,
            bay.substation,
            bay.voltage_level
          ],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Insert Bay failed' })
            }
            return resolve({ success: true, data: bay, message: 'Insert Bay completed' })
          }
        )
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Insert Bay transaction failed' })
      })
  })
}

export const getBayById = async (mrid: string) => {
  try {
    const ecResult: any = await equipmentContainerFunc.getEquipmentContainerById(mrid)
    if (!ecResult.success) {
      return { success: false, data: null, message: 'EquipmentContainer not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM bay WHERE mrid = ?', [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, data: null, message: 'Get Bay failed', err })
        if (!row) return resolve({ success: false, data: null, message: 'Bay not found' })
        const data = { ...ecResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get Bay completed' })
      })
    })
  } catch (err) {
    return { success: false, data: null, message: 'Get Bay failed', err }
  }
}

export const getBayByVoltageLevelOrSubstation = (voltageLevel: string, substation: string) => {
  return new Promise((resolve, reject) => {
    let sql = `
            SELECT 
                b.*, 
                io.*
            FROM bay b
            JOIN identified_object io ON b.mrid = io.mrid
        `

    const params: any[] = []
    const conditions: string[] = []

    if (substation) {
      conditions.push('b.substation = ?')
      params.push(substation)
    }

    if (voltageLevel) {
      conditions.push('b.voltage_level = ?')
      params.push(voltageLevel)
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' OR ')
    }

    db.all(sql, params, (err: any, rows: any) => {
      if (err) {
        console.error('Get Bay by VoltageLevel or Substation failed:', err)
        return reject({
          success: false,
          data: null,
          message: 'Get Bay by VoltageLevel or Substation failed',
          err
        })
      }

      if (!rows || rows.length === 0) {
        return resolve({
          success: false,
          data: [],
          message: 'No bays found'
        })
      }

      return resolve({
        success: true,
        data: rows,
        message: 'Get Bays completed'
      })
    })
  })
}

export const updateBayById = async (mrid: string, bay: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      equipmentContainerFunc
        .updateEquipmentContainerByIdTransaction(mrid, bay, db)
        .then((result: any) => {
          if (!result.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update EquipmentContainer failed',
              err: result.err
            })
          }

          db.run(
            `UPDATE bay SET
                            bay_energy_meas_flag = ?,
                            bay_power_meas_flag = ?,
                            breaker_configuration = ?,
                            bus_bar_configuration = ?,
                            voltage_level = ?,
                            substation = ?
                         WHERE mrid = ?`,
            [
              bay.bay_energy_meas_flag,
              bay.bay_power_meas_flag,
              bay.breaker_configuration,
              bay.bus_bar_configuration,
              bay.voltage_level,
              bay.substation,
              mrid
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update Bay failed' })
              }
              db.run('COMMIT')
              return resolve({ success: true, data: bay, message: 'Update Bay completed' })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({ success: false, err, message: 'Update Bay transaction failed' })
        })
    })
  })
}

export const updateBayByIdTransaction = async (mrid: string, bay: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    equipmentContainerFunc
      .updateEquipmentContainerByIdTransaction(mrid, bay, dbsql)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Update EquipmentContainer failed',
            err: result.err
          })
        }
        dbsql.run(
          `UPDATE bay SET
                        bay_energy_meas_flag = ?,
                        bay_power_meas_flag = ?,
                        breaker_configuration = ?,
                        bus_bar_configuration = ?,
                        voltage_level = ?,
                        substation = ?
                     WHERE mrid = ?`,
          [
            bay.bay_energy_meas_flag,
            bay.bay_power_meas_flag,
            bay.breaker_configuration,
            bay.bus_bar_configuration,
            bay.voltage_level,
            bay.substation,
            mrid
          ],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Update Bay failed' })
            }
            return resolve({ success: true, data: bay, message: 'Update Bay completed' })
          }
        )
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Update Bay transaction failed' })
      })
  })
}

export const deleteBayById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    equipmentContainerFunc
      .deleteEquipmentContainerByIdTransaction(mrid, db)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete EquipmentContainer failed',
            err: result.err
          })
        }
        return resolve({ success: true, message: 'Delete Bay (and EquipmentContainer) completed' })
      })
      .catch((err: any) => {
        return reject({ success: false, err, message: 'Delete Bay transaction failed' })
      })
  })
}

export const deleteBayByIdTransaction = async (mrid: string, dbsql: any) => {
  return equipmentContainerFunc.deleteEquipmentContainerByIdTransaction(mrid, dbsql)
}
