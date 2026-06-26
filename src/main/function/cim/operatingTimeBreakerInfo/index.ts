import db from '../../datacontext/index'

export const getOperatingTimeBreakerInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM operating_time_breaker_info WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get operatingTimeBreakerInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'OperatingTimeBreakerInfo not found' })
                return resolve({ success: true, data: row, message: 'Get operatingTimeBreakerInfo by id completed' })
            }
        )
    })
}

export const getOperatingTimeBreakerInfoByAssessmentLimitBreakerInfoId = async (assessmentLimitId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM operating_time_breaker_info WHERE assessment_limit_breaker_info_id = ?`,
            [assessmentLimitId],
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err, message: 'Get operatingTimeBreakerInfo by assessment_limit_breaker_info_id failed' })
                return resolve({ success: true, data: rows, message: 'Get operatingTimeBreakerInfo by assessment_limit_breaker_info_id completed' })
            }
        )
    })
}

export const insertOperatingTimeBreakerInfoTransaction = async (
    info: {
        mrid: string
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        t_min: string | null
        t_max: string | null
        t_ref: string | null
        t_dev_position: string | null
        t_dev_negative: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO operating_time_breaker_info(
                mrid, assessment_limit_breaker_info_id, parameter_name,
                t_min, t_max, t_ref, t_dev_position, t_dev_negative
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                assessment_limit_breaker_info_id = excluded.assessment_limit_breaker_info_id,
                parameter_name = excluded.parameter_name,
                t_min = excluded.t_min,
                t_max = excluded.t_max,
                t_ref = excluded.t_ref,
                t_dev_position = excluded.t_dev_position,
                t_dev_negative = excluded.t_dev_negative
            `,
            [info.mrid, info.assessment_limit_breaker_info_id, info.parameter_name, info.t_min, info.t_max, info.t_ref, info.t_dev_position, info.t_dev_negative],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert operatingTimeBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert operatingTimeBreakerInfo completed' })
            }
        )
    })
}

export const updateOperatingTimeBreakerInfoTransaction = async (
    mrid: string,
    info: {
        assessment_limit_breaker_info_id: string
        parameter_name: string | null
        t_min: string | null
        t_max: string | null
        t_ref: string | null
        t_dev_position: string | null
        t_dev_negative: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE operating_time_breaker_info SET
                assessment_limit_breaker_info_id = ?,
                parameter_name = ?,
                t_min = ?,
                t_max = ?,
                t_ref = ?,
                t_dev_position = ?,
                t_dev_negative = ?
            WHERE mrid = ?`,
            [info.assessment_limit_breaker_info_id, info.parameter_name, info.t_min, info.t_max, info.t_ref, info.t_dev_position, info.t_dev_negative, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update operatingTimeBreakerInfo failed' })
                return resolve({ success: true, data: info, message: 'Update operatingTimeBreakerInfo completed' })
            }
        )
    })
}

export const deleteOperatingTimeBreakerInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM operating_time_breaker_info WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete operatingTimeBreakerInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete operatingTimeBreakerInfo completed' })
        })
    })
}
