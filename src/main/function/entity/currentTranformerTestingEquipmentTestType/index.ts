import db from '../../datacontext/index'

export const getCurrentTransformerTestingEquipmentTestTypeById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM current_transformer_testing_equipment_test_type WHERE mrid=?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get currentTransformerTestingEquipmentTestType by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'CurrentTransformerTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get currentTransformerTestingEquipmentTestType by id completed'
        })
      }
    )
  })
}

export const getCurrentTransformerTestingEquipmentTestingEqId = async (testingEqId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM current_transformer_testing_equipment_test_type WHERE testing_equipment_id=?`,
      [testingEqId],
      (err: Error | null, rows: unknown[]) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get currentTransformerTestingEquipmentTestType by id failed'
          })
        if (!rows || rows.length === 0)
          return resolve({
            success: false,
            data: null,
            message: 'SurgeArresterTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: rows,
          message: 'Get currentTransformerTestingEquipmentTestType by id completed'
        })
      }
    )
  })
}

export const insertCurrentTransformerTestingEquipmentTestTypeTransaction = async (
  data: { mrid: string; testing_equipment_id: string; test_type_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO current_transformer_testing_equipment_test_type(
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
            message: 'Insert surgeArresterTestingEquipmentTestType failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Insert surgeArresterTestingEquipmentTestType completed'
        })
      }
    )
  })
}

export const updateCurrentTransformerTestingEquipmentTestTypeByIdTransaction = async (
  mrid: string,
  data: { testing_equipment_id: string; test_type_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE current_transformer_testing_equipment_test_type SET
                testing_equipment_id = ?,
                test_type_id = ?
            WHERE mrid = ?`,
      [data.testing_equipment_id, data.test_type_id, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Update currentTransformerTestingEquipmentTestType failed'
          })
        return resolve({
          success: true,
          data: data,
          message: 'Update currentTransformerTestingEquipmentTestType completed'
        })
      }
    )
  })
}

export const deleteCurrentTransformerTestingEquipmentTestTypeByIdTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM current_transformer_testing_equipment_test_type WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Delete currentTransformerTestingEquipmentTestType failed'
          })
        if (this.changes === 0)
          return resolve({
            success: false,
            data: null,
            message: 'CurrentTransformerTestingEquipmentTestType not found'
          })
        return resolve({
          success: true,
          data: null,
          message: 'Delete currentTransformerTestingEquipmentTestType completed'
        })
      }
    )
  })
}
