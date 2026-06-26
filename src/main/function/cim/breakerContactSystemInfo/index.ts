import db from '../../datacontext/index'

export const getBreakerContactSystemInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM breaker_contact_system_info WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get breakerContactSystemInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'BreakerContactSystemInfo not found' })
                return resolve({ success: true, data: row, message: 'Get breakerContactSystemInfo by id completed' })
            }
        )
    })
}

export const getBreakerContactSystemInfoByBreakerInfoId = async (breakerInfoId: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM breaker_contact_system_info WHERE breaker_info_id = ?`,
            [breakerInfoId],
            (err: Error | null, rows: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get breakerContactSystemInfo by breaker_info_id failed' })
                return resolve({ success: true, data: rows, message: 'Get breakerContactSystemInfo by breaker_info_id completed' })
            }
        )
    })
}

export const insertBreakerContactSystemInfoTransaction = async (
    info: { mrid: string; breaker_info_id: string; nominal_total_travel: string | null; damping_time: string | null; nozzle_length: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO breaker_contact_system_info(
                mrid, breaker_info_id, nominal_total_travel, damping_time, nozzle_length
            ) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                breaker_info_id = excluded.breaker_info_id,
                nominal_total_travel = excluded.nominal_total_travel,
                damping_time = excluded.damping_time,
                nozzle_length = excluded.nozzle_length
            `,
            [info.mrid, info.breaker_info_id, info.nominal_total_travel, info.damping_time, info.nozzle_length],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert breakerContactSystemInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert breakerContactSystemInfo completed' })
            }
        )
    })
}

export const updateBreakerContactSystemInfoTransaction = async (
    mrid: string,
    info: { breaker_info_id: string; nominal_total_travel: string | null; damping_time: string | null; nozzle_length: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE breaker_contact_system_info SET
                breaker_info_id = ?,
                nominal_total_travel = ?,
                damping_time = ?,
                nozzle_length = ?
            WHERE mrid = ?`,
            [info.breaker_info_id, info.nominal_total_travel, info.damping_time, info.nozzle_length, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update breakerContactSystemInfo failed' })
                return resolve({ success: true, data: info, message: 'Update breakerContactSystemInfo completed' })
            }
        )
    })
}

export const deleteBreakerContactSystemInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM breaker_contact_system_info WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete breakerContactSystemInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete breakerContactSystemInfo completed' })
        })
    })
}
