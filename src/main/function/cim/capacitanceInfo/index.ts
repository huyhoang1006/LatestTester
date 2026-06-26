import db from '../../datacontext/index'

export const getCapacitanceCapacitorInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM capacitance_capacitor_info WHERE mrid=?', [mrid], (err: Error | null, row: unknown) => {
            if (err) return reject({ success: false, err, message: 'Get capacitanceCapacitorInfo by id failed' })
            if (!row) return resolve({ success: false, data: null, message: 'CapacitanceCapacitorInfo not found' })
            return resolve({ success: true, data: row, message: 'Get capacitanceCapacitorInfo by id completed' })
        })
    })
}

export const getCapacitanceCapacitorInfoByIds = async (capacitorInfoIds: string[]) => {
    return new Promise((resolve, reject) => {
        if (!capacitorInfoIds || capacitorInfoIds.length === 0) {
            return resolve({ success: false, data: [], message: 'No capacitor_info_ids provided' })
        }

        const placeholders = capacitorInfoIds.map(() => '?').join(',')

        db.all(
            `SELECT * FROM capacitance_capacitor_info WHERE capacitor_info_id IN (${placeholders})`,
            capacitorInfoIds,
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err: err, message: 'Get capacitanceCapacitorInfo by ids failed' })
                if (!rows || rows.length === 0) return resolve({ success: false, data: [], message: 'CapacitanceCapacitorInfo not found' })
                return resolve({ success: true, data: rows, message: 'Get capacitanceCapacitorInfo by ids completed' })
            }
        )
    })
}

export const insertCapacitanceCapacitorInfoTransaction = async (
    capacitanceCapacitorInfo: { mrid: string; phase: string | null; value: number | null; capacitor_info_id: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO capacitance_capacitor_info (mrid, phase, value, capacitor_info_id)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                 phase = excluded.phase,
                 value = excluded.value,
                 capacitor_info_id = excluded.capacitor_info_id;`,
            [
                capacitanceCapacitorInfo.mrid,
                capacitanceCapacitorInfo.phase,
                capacitanceCapacitorInfo.value,
                capacitanceCapacitorInfo.capacitor_info_id
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) {
                    return reject({ success: false, err, message: 'Insert capacitanceCapacitorInfo failed' })
                }
                return resolve({ success: true, data: capacitanceCapacitorInfo, message: 'Insert capacitanceCapacitorInfo completed' })
            }
        )
    })
}

export const updateCapacitanceCapacitorInfoTransaction = async (
    mrid: string,
    capacitanceCapacitorInfo: { phase: string | null; value: number | null; capacitor_info_id: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE capacitance_capacitor_info SET
                phase = ?,
                value = ?,
                capacitor_info_id = ?
             WHERE mrid = ?`,
            [capacitanceCapacitorInfo.phase, capacitanceCapacitorInfo.value, capacitanceCapacitorInfo.capacitor_info_id, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update capacitanceCapacitorInfo failed' })
                return resolve({ success: true, data: capacitanceCapacitorInfo, message: 'Update capacitanceCapacitorInfo completed' })
            }
        )
    })
}

export const deleteCapacitanceInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM capacitance_capacitor_info WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete capacitanceCapacitorInfo failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'CapacitanceCapacitorInfo not found' })
            return resolve({ success: true, data: null, message: 'Delete capacitanceCapacitorInfo completed' })
        })
    })
}

export const deleteCapacitanceCapacitorInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM capacitance_capacitor_info WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete capacitance capacitor info failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Capacitance Capacitor Info not found' })
            return resolve({ success: true, data: null, message: 'Delete capacitance capacitor info completed' })
        })
    })
}
