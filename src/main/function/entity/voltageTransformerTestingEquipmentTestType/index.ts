import db from '../../datacontext/index'

export const getVoltageTransformerTestingEquipmentTestTypeById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM voltage_transformer_testing_equipment_test_type WHERE mrid=?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get voltageTransformerTestingEquipmentTestType by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'VoltageTransformerTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get voltageTransformerTestingEquipmentTestType by id completed'
        })
      }
    )
  })
}

export const getVoltageTransformerTestingEquipmentTestingEqId = async (testingEqId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM voltage_transformer_testing_equipment_test_type WHERE testing_equipment_id=?`,
      [testingEqId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get voltageTransformerTestingEquipmentTestType by id failed'
          })
        if (!rows || rows.length === 0)
          return resolve({
            success: false,
            data: null,
            message: 'VoltageTransformerTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get voltageTransformerTestingEquipmentTestType by id completed'
        })
      }
    )
  })
}

export const insertVoltageTransformerTestingEquipmentTestTypeTransaction = async (
  data: { mrid: string; testing_equipment_id: string; test_type_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO voltage_transformer_testing_equipment_test_type(
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
            message: 'Insert voltageTransformerTestingEquipmentTestType failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Insert voltageTransformerTestingEquipmentTestType completed'
        })
      }
    )
  })
}

export const updateVoltageTransformerTestingEquipmentTestTypeByIdTransaction = async (
  mrid: string,
  data: { testing_equipment_id: string; test_type_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE voltage_transformer_testing_equipment_test_type SET
                testing_equipment_id = ?,
                test_type_id = ?
            WHERE mrid = ?`,
      [data.testing_equipment_id, data.test_type_id, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update voltageTransformerTestingEquipmentTestType failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Update voltageTransformerTestingEquipmentTestType completed'
        })
      }
    )
  })
}

export const deleteVoltageTransformerTestingEquipmentTestTypeByIdTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM voltage_transformer_testing_equipment_test_type WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete voltageTransformerTestingEquipmentTestType failed'
          })
        if (this.changes === 0)
          return resolve({
            success: false,
            data: null,
            message: 'VoltageTransformerTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: null,
          message: 'Delete voltageTransformerTestingEquipmentTestType completed'
        })
      }
    )
  })
}
