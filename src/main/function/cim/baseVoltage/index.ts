import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const insertBaseVoltage = async (baseVoltage: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc.insertIdentifiedObjectTransaction(baseVoltage, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `INSERT INTO base_voltage(
                            mrid,
                            nominal_voltage
                        ) VALUES (?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            nominal_voltage = excluded.nominal_voltage`,
                        [
                            baseVoltage.mrid,
                            baseVoltage.nominal_voltage
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Insert baseVoltage failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: baseVoltage, message: 'Insert baseVoltage completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Insert baseVoltage transaction failed' })
                })
        })
    })
}

export const insertBaseVoltageTransaction = async (baseVoltage: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.insertIdentifiedObjectTransaction(baseVoltage, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `INSERT INTO base_voltage(
                        mrid,
                        nominal_voltage
                    ) VALUES (?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        nominal_voltage = excluded.nominal_voltage`,
                    [
                        baseVoltage.mrid,
                        baseVoltage.nominal_voltage
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert baseVoltage failed' })
                        }
                        return resolve({ success: true, data: baseVoltage, message: 'Insert baseVoltage completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Insert baseVoltage transaction failed' })
            })
    })
}

export const getBaseVoltageById = async (mrid: string) => {
    try {
        const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
        if (!identifiedResult.success) {
            return { success: false, data: null, message: 'Identified object not found' }
        }
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM base_voltage WHERE mrid = ?", [mrid], (err: any, row: any) => {
                if (err) return reject({ success: false, err, message: 'Get baseVoltage failed' })
                if (!row) return resolve({ success: false, data: null, message: 'BaseVoltage not found' })
                const data = { ...identifiedResult.data, ...row }
                return resolve({ success: true, data : data, message: 'Get baseVoltage completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get baseVoltage failed' }
    }
}

export const getBaseVoltageByIds = async (mrids: string[]) => {
    return new Promise((resolve, reject) => {
        if (!mrids || mrids.length === 0) {
            return resolve({ success: false, data: [], message: 'No mrids provided' })
        }

        const placeholders = mrids.map(() => '?').join(',')

        db.all(
            `SELECT * FROM base_voltage WHERE mrid IN (${placeholders})`,
            mrids,
            (err: any, rows: any) => {
                if (err) {
                    return reject({ success: false, err: err, message: 'Get base voltage by ids failed' })
                }
                if (!rows || rows.length === 0) {
                    return resolve({ success: false, data: [], message: 'Base voltage not found' })
                }
                return resolve({ success: true, data: rows, message: 'Get base voltage by ids completed' })
            }
        )
    })
}

export const updateBaseVoltageById = async (mrid: string, baseVoltage: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, baseVoltage, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `UPDATE base_voltage SET
                            nominal_voltage = ?
                        WHERE mrid = ?`,
                        [
                            baseVoltage.nominal_voltage,
                            mrid
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Update baseVoltage failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: baseVoltage, message: 'Update baseVoltage completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update baseVoltage transaction failed' })
                })
        })
    })
}

export const updateBaseVoltageByIdTransaction = async (mrid: string, baseVoltage: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, baseVoltage, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `UPDATE base_voltage SET
                        nominal_voltage = ?
                    WHERE mrid = ?`,
                    [
                        baseVoltage.nominal_voltage,
                        mrid
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update baseVoltage failed' })
                        }
                        return resolve({ success: true, data: baseVoltage, message: 'Update baseVoltage completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Update baseVoltage transaction failed' })
            })
    })
}

export const deleteBaseVoltageById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete identified object failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete baseVoltage (and identified object) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete baseVoltage transaction failed' })
            })
    })
}

export const deleteBaseVoltageByIdTransaction = async (mrid: string, dbsql: any) => {
    return identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
}

export const getBaseVoltageByLocationIdTransaction = async (locationId: string, dbsql: any) => {
    try {
        return new Promise((resolve, reject) => {
            dbsql.all("SELECT * FROM base_voltage WHERE location = ?", [locationId], (err: any, rows: any) => {
                if (err) return reject({ success: false, err, message: 'Get baseVoltage failed' })
                if (!rows || rows.length === 0) return resolve({ success: false, data: null, message: 'BaseVoltage not found' })
                const data = rows.map((row: any) => ({ ...row }))
                return resolve({ success: true, data: data, message: 'Get baseVoltage completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get baseVoltage failed' }
    }
}
