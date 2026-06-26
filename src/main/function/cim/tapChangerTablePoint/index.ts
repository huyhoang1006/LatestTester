import db from '../../datacontext/index'

export const getTapChangerTablePointById = async (mrid: string) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM tap_changer_table_point WHERE mrid=?`,
                [mrid],
                (err: Error | null, row: unknown) => {
                    if (err) return reject({ success: false, err, message: 'Get tapChangerTablePoint by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'TapChangerTablePoint not found' })
                    return resolve({ success: true, data: row, message: 'Get tapChangerTablePoint by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get tapChangerTablePoint by id failed' }
    }
}

export const getTapChangerTablePointByTapChangerInfoId = async (tap_changer_info_id: string) => {
    try {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM tap_changer_table_point WHERE tap_changer_info_id=?`,
                [tap_changer_info_id],
                (err: Error | null, row: unknown[]) => {
                    if (err) return reject({ success: false, err, message: 'Get tapChangerTablePoint by tap changer info id failed' })
                    if (!row || row.length == 0) return resolve({ success: false, data: null, message: 'TapChangerTablePoint not found' })
                    return resolve({ success: true, data: row, message: 'Get tapChangerTablePoint by tap changer info id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get tapChangerTablePoint by tap changer info id failed' }
    }
}

export const insertTapChangerTablePointTransaction = async (
    info: { mrid: string; step: string | null; voltage: string | null; tap_changer_info_id: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        try {
            dbsql.run(
                `INSERT INTO tap_changer_table_point(
                    mrid, step, voltage, tap_changer_info_id
                ) VALUES (?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    step = excluded.step,
                    voltage = excluded.voltage,
                    tap_changer_info_id = excluded.tap_changer_info_id
                `,
                [info.mrid, info.step, info.voltage, info.tap_changer_info_id],
                function (this: { lastID: number; changes: number }, err: Error | null) {
                    if (err) {
                        return reject({ success: false, err, message: 'Insert tapChangerTablePoint failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Insert tapChangerTablePoint completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert tapChangerTablePoint transaction failed' })
        }
    })
}

export const updateTapChangerTablePointTransaction = async (
    mrid: string,
    info: { step: string | null; voltage: string | null; tap_changer_info_id: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        try {
            dbsql.run(
                `UPDATE tap_changer_table_point SET
                    step = ?,
                    voltage = ?,
                    tap_changer_info_id = ?
                WHERE mrid = ?`,
                [info.step, info.voltage, info.tap_changer_info_id, mrid],
                function (this: { lastID: number; changes: number }, err: Error | null) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update tapChangerTablePoint failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update tapChangerTablePoint completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update tapChangerTablePoint transaction failed' })
        }
    })
}

export const deleteTapChangerTablePointTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        try {
            dbsql.run('DELETE FROM tap_changer_table_point WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) {
                    return reject({ success: false, err, message: 'Delete tapChangerTablePoint failed' })
                }
                return resolve({ success: true, data: mrid, message: 'Delete tapChangerTablePoint completed' })
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete tapChangerTablePoint transaction failed' })
        }
    })
}
