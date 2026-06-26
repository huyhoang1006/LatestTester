import db from '../../datacontext/index'

export const getContactResistanceBreakerInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM contact_resistance_breaker_info WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get contactResistanceBreakerInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'ContactResistanceBreakerInfo not found' })
                return resolve({ success: true, data: row, message: 'Get contactResistanceBreakerInfo by id completed' })
            }
        )
    })
}

export const getContactResistanceBreakerInfoByAssessmentLimitBreakerInfoId = async (assessmentLimitId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM contact_resistance_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
            [assessmentLimitId],
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err, message: 'Get contactResistanceBreakerInfo by assessment_limit_breaker_info_id failed' })
                return resolve({ success: true, data: rows, message: 'Get contactResistanceBreakerInfo by assessment_limit_breaker_info_id completed' })
            }
        )
    })
}

export const insertContactResistanceBreakerInfoTransaction = async (
    info: {
        mrid: string
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        r_min: string | null
        r_max: string | null
        r_ref: string | null
        r_dev: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO contact_resistance_breaker_info(
                mrid, assessment_limit_breaker_info_id, parameter_name, r_min, r_max, r_ref, r_dev
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id,
                parameter_name = excluded.parameter_name,
                r_min = excluded.r_min,
                r_max = excluded.r_max,
                r_ref = excluded.r_ref,
                r_dev = excluded.r_dev
            `,
            [info.mrid, info.assessment_limit_breaker_info_id, info.parameter_name, info.r_min, info.r_max, info.r_ref, info.r_dev],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert contactResistanceBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert contactResistanceBreakerInfo completed' })
            }
        )
    })
}

export const updateContactResistanceBreakerInfoTransaction = async (
    mrid: string,
    info: {
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        r_min: string | null
        r_max: string | null
        r_ref: string | null
        r_dev: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE contact_resistance_breaker_info SET
                assessment_limit_breaker_info_id = ?,
                parameter_name = ?,
                r_min = ?,
                r_max = ?,
                r_ref = ?,
                r_dev = ?
            WHERE mrid = ?`,
            [info.assessment_limit_breaker_info_id, info.parameter_name, info.r_min, info.r_max, info.r_ref, info.r_dev, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update contactResistanceBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Update contactResistanceBreakerInfo completed' })
            }
        )
    })
}

export const deleteContactResistanceBreakerInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM contact_resistance_breaker_info WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete contactResistanceBreakerInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete contactResistanceBreakerInfo completed' })
        })
    })
}
