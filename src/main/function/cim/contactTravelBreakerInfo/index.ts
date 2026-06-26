import db from '../../datacontext/index'

export const getContactTravelBreakerInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM contact_travel_breaker_info WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get contactTravelBreakerInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'ContactTravelBreakerInfo not found' })
                return resolve({ success: true, data: row, message: 'Get contactTravelBreakerInfo by id completed' })
            }
        )
    })
}

export const getContactTravelBreakerInfoByAssessmentLimitBreakerInfoId = async (assessmentLimitId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM contact_travel_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
            [assessmentLimitId],
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err, message: 'Get contactTravelBreakerInfo by assessment_limit_breaker_info_id failed' })
                return resolve({ success: true, data: rows, message: 'Get contactTravelBreakerInfo by assessment_limit_breaker_info_id completed' })
            }
        )
    })
}

export const insertContactTravelBreakerInfoTransaction = async (
    info: {
        mrid: string
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        d_min: string | null
        d_max: string | null
        d_ref: string | null
        d_dev: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO contact_travel_breaker_info(
                mrid, assessment_limit_breaker_info_id, parameter_name, d_min, d_max, d_ref, d_dev
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id,
                parameter_name = excluded.parameter_name,
                d_min = excluded.d_min,
                d_max = excluded.d_max,
                d_ref = excluded.d_ref,
                d_dev = excluded.d_dev
            `,
            [
                info.mrid,
                info.assessment_limit_breaker_info_id,
                info.parameter_name,
                info.d_min,
                info.d_max,
                info.d_ref,
                info.d_dev
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert contactTravelBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert contactTravelBreakerInfo completed' })
            }
        )
    })
}

export const updateContactTravelBreakerInfoTransaction = async (
    mrid: string,
    info: {
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        d_min: string | null
        d_max: string | null
        d_ref: string | null
        d_dev: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE contact_travel_breaker_info SET
                assessment_limit_breaker_info_id = ?,
                parameter_name = ?,
                d_min = ?,
                d_max = ?,
                d_ref = ?,
                d_dev = ?
            WHERE mrid = ?`,
            [
                info.assessment_limit_breaker_info_id,
                info.parameter_name,
                info.d_min,
                info.d_max,
                info.d_ref,
                info.d_dev,
                mrid
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update contactTravelBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Update contactTravelBreakerInfo completed' })
            }
        )
    })
}

export const deleteContactTravelBreakerInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM contact_travel_breaker_info WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete contactTravelBreakerInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete contactTravelBreakerInfo completed' })
        })
    })
}
