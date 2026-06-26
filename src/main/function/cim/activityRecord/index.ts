import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index.js'

export const insertActivityRecord = async (activity: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc
                .insertIdentifiedObjectTransaction(activity, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `INSERT INTO activity_record(
                            mrid, status, created_date_time, reason, severity, type
                        ) VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            status = excluded.status,
                            created_date_time = excluded.created_date_time,
                            reason = excluded.reason,
                            severity = excluded.severity,
                            type = excluded.type`,
                        [
                            activity.mrid,
                            activity.status,
                            activity.created_date_time,
                            activity.reason,
                            activity.severity,
                            activity.type
                        ],
                        function (this: { lastID: number; changes: number }, err: Error | null) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Insert activity record failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: activity, message: 'Insert activity record completed' })
                        }
                    )
                })
                .catch((err: Error) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Insert activity record transaction failed' })
                })
        })
    })
}

export const insertActivityRecordTransaction = async (activity: any, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc
            .insertIdentifiedObjectTransaction(activity, dbsql)
            .then(() => {
                dbsql.run(
                    `INSERT INTO activity_record(
                        mrid, status, created_date_time, reason, severity, type
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        status = excluded.status,
                        created_date_time = excluded.created_date_time,
                        reason = excluded.reason,
                        severity = excluded.severity,
                        type = excluded.type`,
                    [
                        activity.mrid,
                        activity.status,
                        activity.created_date_time,
                        activity.reason,
                        activity.severity,
                        activity.type
                    ],
                    function (this: { lastID: number; changes: number }, err: Error | null) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert activity record failed' })
                        }
                        return resolve({ success: true, data: activity, message: 'Insert activity record completed' })
                    }
                )
            })
            .catch((err: Error) => {
                return reject({ success: false, err, message: 'Insert activity record transaction failed' })
            })
    })
}

export const getActivityRecordById = async (mrid: string) => {
    try {
        const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
        if (!identifiedResult.success) {
            return { success: false, data: null, message: 'Identified object not found' }
        }
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM activity_record WHERE mrid = ?', [mrid], (err: Error | null, row: any) => {
                if (err) return reject({ success: false, err, message: 'Get activity record failed' })
                if (!row) return resolve({ success: false, data: null, message: 'Activity record not found' })
                const data = { ...identifiedResult.data, ...row }
                return resolve({ success: true, data: data, message: 'Get activity record completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get activity record failed' }
    }
}

export const updateActivityRecordById = async (mrid: string, activity: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc
                .updateIdentifiedObjectByIdTransaction(mrid, activity, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `UPDATE activity_record SET
                            status = ?,
                            created_date_time = ?,
                            reason = ?,
                            severity = ?,
                            type = ?
                         WHERE mrid = ?`,
                        [
                            activity.status,
                            activity.created_date_time,
                            activity.reason,
                            activity.severity,
                            activity.type,
                            mrid
                        ],
                        function (this: { lastID: number; changes: number }, err: Error | null) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Update activity record failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: activity, message: 'Update activity record completed' })
                        }
                    )
                })
                .catch((err: Error) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update activity record transaction failed' })
                })
        })
    })
}

export const updateActivityRecordByIdTransaction = async (mrid: string, activity: any, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc
            .updateIdentifiedObjectByIdTransaction(mrid, activity, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `UPDATE activity_record SET
                        status = ?,
                        created_date_time = ?,
                        reason = ?,
                        severity = ?,
                        type = ?
                     WHERE mrid = ?`,
                    [
                        activity.status,
                        activity.created_date_time,
                        activity.reason,
                        activity.severity,
                        activity.type,
                        mrid
                    ],
                    function (this: { lastID: number; changes: number }, err: Error | null) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update activity record failed' })
                        }
                        return resolve({ success: true, data: activity, message: 'Update activity record completed' })
                    }
                )
            })
            .catch((err: Error) => {
                return reject({ success: false, err, message: 'Update activity record transaction failed' })
            })
    })
}

export const deleteActivityRecordById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc
            .deleteIdentifiedObjectByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete identified object failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete activity record (and identified object) completed' })
            })
            .catch((err: Error) => {
                return reject({ success: false, err, message: 'Delete activity record transaction failed' })
            })
    })
}

export const deleteActivityRecordByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
}
