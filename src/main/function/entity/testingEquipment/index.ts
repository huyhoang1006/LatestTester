import db from '../../datacontext/index'

export const getTestingEquipmentById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM testing_equipment WHERE mrid=?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get testingEquipment by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'TestingEquipment not found' })
                return resolve({ success: true, data: row, message: 'Get testingEquipment by id completed' })
            }
        )
    })
}

export const getTestingEquipmentByWorkId = async (workId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM testing_equipment WHERE work_id=?`,
            [workId],
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err, message: 'Get testingEquipment by workId failed' })
                if (!rows || rows.length === 0) return resolve({ success: false, data: null, message: 'TestingEquipment not found' })
                return resolve({ success: true, data: rows, message: 'Get testingEquipment by workId completed' })
            }
        )
    })
}

export const insertTestingEquipmentTransaction = async (
    testingEquipment: { mrid: string; model: string | null; serial_number: string | null; work_id: string | null; calibration_date: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO testing_equipment(
                mrid, model, serial_number, work_id, calibration_date
            ) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                model = excluded.model,
                serial_number = excluded.serial_number,
                work_id = excluded.work_id,
                calibration_date = excluded.calibration_date
            `,
            [testingEquipment.mrid, testingEquipment.model, testingEquipment.serial_number, testingEquipment.work_id, testingEquipment.calibration_date],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert testingEquipment failed' })
                return resolve({ success: true, data: testingEquipment, message: 'Insert testingEquipment completed' })
            }
        )
    })
}

export const updateTestingEquipmentByIdTransaction = async (
    mrid: string,
    testingEquipment: { model: string | null; serial_number: string | null; work_id: string | null; calibration_date: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE testing_equipment SET
                model = ?,
                serial_number = ?,
                work_id = ?,
                calibration_date = ?
            WHERE mrid = ?`,
            [testingEquipment.model, testingEquipment.serial_number, testingEquipment.work_id, testingEquipment.calibration_date, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update testingEquipment failed' })
                return resolve({ success: true, data: testingEquipment, message: 'Update testingEquipment completed' })
            }
        )
    })
}

export const deleteTestingEquipmentByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM testing_equipment WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete testingEquipment failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'TestingEquipment not found' })
            return resolve({ success: true, data: null, message: 'Delete testingEquipment completed' })
        })
    })
}
