import db from '../../datacontext/index'

// Lấy calibrationRecord theo mrid
export const getCalibrationRecordById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM calibration_record WHERE mrid=?`, [mrid], (err: any, row: any) => {
      if (err) return reject({ success: false, err, message: 'Get calibrationRecord by id failed' })
      if (!row)
        return resolve({ success: false, data: null, message: 'CalibrationRecord not found' })
      return resolve({ success: true, data: row, message: 'Get calibrationRecord by id completed' })
    })
  })
}

// Lấy calibrationRecord theo testing_equipment
export const getCalibrationRecordByTestingEquipmentId = async (testingEquipmentId: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM calibration_record WHERE testing_equipment=?`,
      [testingEquipmentId],
      (err: any, rows: any) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get calibrationRecord by testingEquipment failed'
          })
        if (!rows || rows.length === 0)
          return resolve({ success: false, data: null, message: 'CalibrationRecord not found' })
        return resolve({
          success: true,
          data: rows,
          message: 'Get calibrationRecord by testingEquipment completed'
        })
      }
    )
  })
}

// Thêm mới calibrationRecord
export const insertCalibrationRecordTransaction = async (calibrationRecord: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO calibration_record(
                mrid,
                testing_equipment,
                calibration_date,
                due_date,
                interval_months,
                provider,
                certificate_number,
                result,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                testing_equipment = excluded.testing_equipment,
                calibration_date = excluded.calibration_date,
                due_date = excluded.due_date,
                interval_months = excluded.interval_months,
                provider = excluded.provider,
                certificate_number = excluded.certificate_number,
                result = excluded.result,
                notes = excluded.notes
            `,
      [
        calibrationRecord.mrid,
        calibrationRecord.testing_equipment,
        calibrationRecord.calibration_date,
        calibrationRecord.due_date,
        calibrationRecord.interval_months,
        calibrationRecord.provider,
        calibrationRecord.certificate_number,
        calibrationRecord.result,
        calibrationRecord.notes
      ],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Insert calibrationRecord failed' })
        return resolve({
          success: true,
          data: calibrationRecord,
          message: 'Insert calibrationRecord completed'
        })
      }
    )
  })
}

// Cập nhật calibrationRecord
export const updateCalibrationRecordByIdTransaction = async (
  mrid: string,
  calibrationRecord: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE calibration_record SET
                testing_equipment = ?,
                calibration_date = ?,
                due_date = ?,
                interval_months = ?,
                provider = ?,
                certificate_number = ?,
                result = ?,
                notes = ?
            WHERE mrid = ?`,
      [
        calibrationRecord.testing_equipment,
        calibrationRecord.calibration_date,
        calibrationRecord.due_date,
        calibrationRecord.interval_months,
        calibrationRecord.provider,
        calibrationRecord.certificate_number,
        calibrationRecord.result,
        calibrationRecord.notes,
        mrid
      ],
      function (err: any) {
        if (err) return reject({ success: false, err, message: 'Update calibrationRecord failed' })
        return resolve({
          success: true,
          data: calibrationRecord,
          message: 'Update calibrationRecord completed'
        })
      }
    )
  })
}

// Xóa calibrationRecord
export const deleteCalibrationRecordByIdTransaction = async (mrid: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `DELETE FROM calibration_record WHERE mrid=?`,
      [mrid],
      function (this: { changes: number }, err: any) {
        if (err) return reject({ success: false, err, message: 'Delete calibrationRecord failed' })
        if (this.changes === 0)
          return resolve({ success: false, data: null, message: 'CalibrationRecord not found' })
        return resolve({ success: true, data: null, message: 'Delete calibrationRecord completed' })
      }
    )
  })
}
