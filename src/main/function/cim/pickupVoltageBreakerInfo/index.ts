import db from '../../datacontext/index'

export const getPickupVoltageBreakerInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM pickup_voltage_breaker_info WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get pickupVoltageBreakerInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'PickupVoltageBreakerInfo not found' })
                return resolve({ success: true, data: row, message: 'Get pickupVoltageBreakerInfo by id completed' })
            }
        )
    })
}

export const getPickupVoltageBreakerInfoByAssessmentLimitId = async (assessmentLimitId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM pickup_voltage_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
            [assessmentLimitId],
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err, message: 'Get pickupVoltageBreakerInfo by assessment_limit_breaker_info_id failed' })
                return resolve({ success: true, data: rows, message: 'Get pickupVoltageBreakerInfo by assessment_limit_breaker_info_id completed' })
            }
        )
    })
}

export const insertPickupVoltageBreakerInfoTransaction = async (
    info: {
        mrid: string
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        v_min: string | null
        v_max: string | null
        v_ref: string | null
        v_dev: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO pickup_voltage_breaker_info(
                mrid, assessment_limit_breaker_info_id, parameter_name, v_min, v_max, v_ref, v_dev
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id,
                parameter_name = excluded.parameter_name,
                v_min = excluded.v_min,
                v_max = excluded.v_max,
                v_ref = excluded.v_ref,
                v_dev = excluded.v_dev
            `,
            [
                info.mrid,
                info.assessment_limit_breaker_info_id,
                info.parameter_name,
                info.v_min,
                info.v_max,
                info.v_ref,
                info.v_dev
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert pickupVoltageBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert pickupVoltageBreakerInfo completed' })
            }
        )
    })
}

export const updatePickupVoltageBreakerInfoTransaction = async (
    mrid: string,
    info: {
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        v_min: string | null
        v_max: string | null
        v_ref: string | null
        v_dev: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE pickup_voltage_breaker_info SET
                assessment_limit_breaker_info_id = ?,
                parameter_name = ?,
                v_min = ?,
                v_max = ?,
                v_ref = ?,
                v_dev = ?
            WHERE mrid = ?`,
            [info.assessment_limit_breaker_info_id, info.parameter_name, info.v_min, info.v_max, info.v_ref, info.v_dev, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update pickupVoltageBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Update pickupVoltageBreakerInfo completed' })
            }
        )
    })
}

export const deletePickupVoltageBreakerInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM pickup_voltage_breaker_info WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete pickupVoltageBreakerInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete pickupVoltageBreakerInfo completed' })
        })
    })
}
