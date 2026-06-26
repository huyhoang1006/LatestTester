import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const insertPsrType = async (psrType: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc.insertIdentifiedObjectTransaction(psrType, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `INSERT INTO psr_type(mrid) VALUES (?)
                         ON CONFLICT(mrid) DO NOTHING`,
                        [psrType.mrid],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Insert psrType failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: psrType, message: 'Insert psrType completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Insert psrType transaction failed' })
                })
        })
    })
}

export const insertPsrTypeTransaction = async (psrType: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.insertIdentifiedObjectTransaction(psrType, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `INSERT INTO psr_type(mrid) VALUES (?)
                     ON CONFLICT(mrid) DO NOTHING`,
                    [psrType.mrid],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert psrType failed' })
                        }
                        return resolve({ success: true, data: psrType, message: 'Insert psrType completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Insert psrType transaction failed' })
            })
    })
}

export const getPsrTypeById = async (mrid: string) => {
    try {
        const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
        if (!identifiedResult.success) {
            return { success: false, data: null, message: 'Identified object not found' }
        }
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM psr_type WHERE mrid = ?", [mrid], (err: any, row: any) => {
                if (err) return reject({ success: false, err, message: 'Get psrType failed' })
                if (!row) return resolve({ success: false, data: null, message: 'PsrType not found' })
                const data = { ...identifiedResult.data, ...row }
                return resolve({ success: true, data : data, message: 'Get psrType completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get psrType failed' }
    }
}

export const updatePsrTypeById = async (mrid: string, psrType: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, psrType, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `UPDATE psr_type SET
                            mrid = ?
                         WHERE mrid = ?`,
                        [
                            psrType.mrid,
                            mrid
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Update psrType failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: psrType, message: 'Update psrType completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update psrType transaction failed' })
                })
        })
    })
}

export const updatePsrTypeByIdTransaction = async (mrid: string, psrType: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, psrType, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `UPDATE psr_type SET
                        mrid = ?
                     WHERE mrid = ?`,
                    [
                        psrType.mrid,
                        mrid
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update psrType failed' })
                        }
                        return resolve({ success: true, data: psrType, message: 'Update psrType completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Update psrType transaction failed' })
            })
    })
}

export const deletePsrTypeById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete identified object failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete psrType (and identified object) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete psrType transaction failed' })
            })
    })
}

export const deletePsrTypeByIdTransaction = async (mrid: string, dbsql: any) => {
    return identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
}
