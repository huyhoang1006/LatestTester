import db from '../../datacontext/index'
import * as measurementFunc from '../measurement/index'

export const getStringMeasurementById = async (mrid: string) => {
    try {
        const measurement: any = await measurementFunc.getMeasurementById(mrid)
        if (!measurement.success) {
            return { success: false, data: null, message: 'Measurement not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM string_measurement WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get stringMeasurement by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'StringMeasurement not found' })
                    return resolve({ success: true, data: { ...measurement.data, ...row }, message: 'Get stringMeasurement by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get stringMeasurement by id failed' }
    }
}

export const getAllStringMeasurementByProcedureIds = (procedureIds: string[]) => {
    try {
        return new Promise((resolve, reject) => {

            if (!procedureIds || procedureIds.length === 0) {
                return resolve({
                    success: true,
                    data: [],
                    message: 'No procedureIds provided'
                });
            }

            const placeholders = procedureIds.map(() => '?').join(', ');

            const sql = `
                SELECT 
                    sm.*,
                    m.*,
                    io.*
                FROM measurement_procedure mp
                JOIN measurement m ON mp.measurement_id = m.mrid
                JOIN string_measurement sm ON m.mrid = sm.mrid
                JOIN identified_object io ON m.mrid = io.mrid
                WHERE mp.procedure_id IN (${placeholders})
            `;

            db.all(sql, procedureIds, (err: any, rows: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get all string measurement by procedures failed'
                    });
                }

                if (!rows || rows.length === 0) {
                    return resolve({
                        success: false,
                        data: [],
                        message: 'No analog found for these procedures'
                    });
                }

                return resolve({
                    success: true,
                    data: rows,
                    message: 'Get all string measurement by procedures completed'
                });
            });
        });
    } catch (err) {
        return { success: false, err, message: 'Get all string measurement by procedures failed' };
    }
};

export const getAllStringMeasurementByProcedure = (procedureId: string) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT sm.*, m.*, io.*
                FROM measurement_procedure mp
                LEFT JOIN measurement m ON mp.measurement_id = m.mrid
                LEFT JOIN string_measurement sm ON sm.mrid = m.mrid
                LEFT JOIN identified_object io ON m.mrid = io.mrid
                WHERE mp.procedure_id = ?
            `
            db.all(sql, [procedureId], (err: any, rows: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get all string measurement by procedure failed'
                    })
                }
                if (!rows || rows.length === 0) {
                    return resolve({
                        success: false,
                        data: [],
                        message: 'No string measurement found'
                    })
                }
                return resolve({
                    success: true,
                    data: rows,
                    message: 'Get all string measurement by procedure completed'
                })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get all string measurement by procedure failed' }
    }
}

export const insertStringMeasurementTransaction = async (stringMeasurement: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const measResult: any = await measurementFunc.insertMeasurementTransaction(stringMeasurement, dbsql)
            if (!measResult.success) {
                return reject({ success: false, message: 'Insert string measurement failed', err: measResult.err })
            }
            dbsql.run(
                `INSERT INTO string_measurement(
                    mrid
                ) VALUES (?)
                ON CONFLICT(mrid) DO NOTHING
                `,
                [
                    stringMeasurement.mrid
                ],
                function (err: any) {
                    if (err) return reject({ success: false, err, message: 'Insert stringMeasurement failed' })
                    return resolve({ success: true, data: stringMeasurement, message: 'Insert stringMeasurement completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert stringMeasurement failed' })
        }
    })
}

export const insertStringMeasurement = async (stringMeasurement: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION', async (err: any) => {
                if (err) {
                    return reject({ success: false, err, message: 'Begin transaction failed' });
                }

                try {
                    const measResult: any = await measurementFunc.insertMeasurementTransaction(stringMeasurement, db);
                    if (!measResult.success) {
                        db.run('ROLLBACK');
                        return reject({ success: false, message: 'Insert string measurement failed', err: measResult.err });
                    }

                    db.run(
                        `
                        INSERT INTO string_measurement(
                            mrid
                        ) VALUES (?)
                        ON CONFLICT(mrid) DO NOTHING
                        `,
                        [
                            stringMeasurement.mrid
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject({ success: false, err, message: 'Insert string measurement failed' });
                            }
                            db.run('COMMIT', (err: any) => {
                                if (err) {
                                    return reject({ success: false, err, message: 'Commit failed' });
                                }
                                return resolve({
                                    success: true,
                                    data: stringMeasurement,
                                    message: 'Insert string measurement completed'
                                });
                            });
                        }
                    );
                } catch (err) {
                    db.run('ROLLBACK');
                    return reject({ success: false, err, message: 'Insert string measurement failed (exception)' });
                }
            });
        });
    });
};

export const updateStringMeasurementByIdTransaction = async (mrid: string, stringMeasurement: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const measResult: any = await measurementFunc.updateMeasurementByIdTransaction(mrid, stringMeasurement, dbsql)
            if (!measResult.success) {
                return reject({ success: false, message: 'Update measurement failed', err: measResult.err })
            }
            dbsql.run(
                `UPDATE string_measurement SET
                    mrid = ?
                WHERE mrid = ?`,
                [
                    stringMeasurement.mrid,
                    mrid
                ],
                function (err: any) {
                    if (err) return reject({ success: false, err, message: 'Update stringMeasurement failed' })
                    return resolve({ success: true, data: stringMeasurement, message: 'Update stringMeasurement completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update stringMeasurement failed' })
        }
    })
}

export const deleteStringMeasurementByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM string_measurement WHERE mrid=?", [mrid], function (this: any, err: any) {
                if (err) return reject({ success: false, err, message: 'Delete stringMeasurement failed' })
                if (this.changes === 0) return resolve({ success: false, data: null, message: 'StringMeasurement not found' })
                measurementFunc.deleteMeasurementByIdTransaction(mrid, dbsql)
                return resolve({ success: true, data: null, message: 'Delete stringMeasurement completed' })
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete stringMeasurement failed' })
        }
    })
}

export const deleteStringMeasurementById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION', async (err: any) => {
                if (err) {
                    return reject({ success: false, err, message: 'Begin transaction failed' });
                }

                try {
                    db.run("DELETE FROM string_measurement WHERE mrid=?", [mrid], function (this: any, err: any) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject({ success: false, err, message: 'Delete string_measurement failed' });
                        }

                        if (this.changes === 0) {
                            db.run('ROLLBACK');
                            return resolve({ success: false, data: null, message: 'StringMeasurement not found' });
                        }

                        measurementFunc.deleteMeasurementByIdTransaction(mrid, db)
                            .then(() => {
                                db.run('COMMIT', (err: any) => {
                                    if (err) {
                                        return reject({ success: false, err, message: 'Commit failed' });
                                    }
                                    return resolve({
                                        success: true,
                                        data: null,
                                        message: 'Delete string measurement & measurement completed'
                                    });
                                });
                            })
                            .catch((err: any) => {
                                db.run('ROLLBACK');
                                return reject({ success: false, err, message: 'Delete measurement failed' });
                            });
                    });
                } catch (err) {
                    db.run('ROLLBACK');
                    return reject({ success: false, err, message: 'Delete string measurement transaction failed' });
                }
            });
        });
    });
};
