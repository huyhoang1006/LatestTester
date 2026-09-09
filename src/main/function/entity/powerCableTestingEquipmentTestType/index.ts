import db from '../../datacontext/index'

export const getPowerCableTestingEquipmentTestTypeById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM power_cable_testing_equipment_test_type WHERE mrid=?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get powerCableTestingEquipmentTestType by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'PowerCableTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get powerCableTestingEquipmentTestType by id completed'
        })
      }
    )
  })
}

export const getPowerCableTestingEquipmentTestingEqId = async (testingEqId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM power_cable_testing_equipment_test_type WHERE testing_equipment_id=?`,
      [testingEqId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get powerCableTestingEquipmentTestType by id failed'
          })
        if (!rows || rows.length === 0)
          return resolve({
            success: false,
            data: null,
            message: 'PowerCableTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get powerCableTestingEquipmentTestType by id completed'
        })
      }
    )
  })
}

export const insertPowerCableTestingEquipmentTestTypeTransaction = async (
  data: { mrid: string; testing_equipment_id: string; test_type_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO power_cable_testing_equipment_test_type(
                mrid, testing_equipment_id, test_type_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                testing_equipment_id = excluded.testing_equipment_id,
                test_type_id = excluded.test_type_id
            `,
      [data.mrid, data.testing_equipment_id, data.test_type_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Insert powerCableTestingEquipmentTestType failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Insert powerCableTestingEquipmentTestType completed'
        })
      }
    )
  })
}

export const updatePowerCableTestingEquipmentTestTypeByIdTransaction = async (
  mrid: string,
  data: { testing_equipment_id: string; test_type_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE power_cable_testing_equipment_test_type SET
                testing_equipment_id = ?,
                test_type_id = ?
            WHERE mrid = ?`,
      [data.testing_equipment_id, data.test_type_id, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update powerCableTestingEquipmentTestType failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Update powerCableTestingEquipmentTestType completed'
        })
      }
    )
  })
}

export const deletePowerCableTestingEquipmentTestTypeByIdTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM power_cable_testing_equipment_test_type WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete powerCableTestingEquipmentTestType failed'
          })
        if (this.changes === 0)
          return resolve({
            success: false,
            data: null,
            message: 'PowerCableTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: null,
          message: 'Delete powerCableTestingEquipmentTestType completed'
        })
      }
    )
  })
}
