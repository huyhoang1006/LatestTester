import db from '../../datacontext/index'
import * as MeasurementFunc from '../measurement/index'

export const getDiscreteById = async (mrid: string) => {
    try {
        const measurementResult: any = await MeasurementFunc.getMeasurementById(mrid)
        if (!measurementResult.success) {
            return { success: false, data: null, message: 'Measurement not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM discrete WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get discrete by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'Discrete not found' })
                    return resolve({ success: true, data: { ...measurementResult.data, ...row }, message: 'Get discrete by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get discrete by id failed' }
    }
}

export const getAllDiscreteByProcedureIds = (procedureIds: string[]) => {
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
                    d.*,
                    m.*,
                    io.*
                FROM measurement_procedure mp
                JOIN measurement m ON mp.measurement_id = m.mrid
                JOIN discrete d ON m.mrid = d.mrid
                JOIN identified_object io ON m.mrid = io.mrid
                WHERE mp.procedure_id IN (${placeholders})
            `;

            db.all(sql, procedureIds, (err: any, rows: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get all discrete by procedures failed'
                    });
                }

                if (!rows || rows.length === 0) {
                    return resolve({
                        success: false,
                        data: [],
                        message: 'No discrete found for these procedures'
                    });
                }

                return resolve({
                    success: true,
                    data: rows,
                    message: 'Get all discrete by procedures completed'
                });
            });
        });
    } catch (err) {
        return { success: false, err, message: 'Get all discrete by procedures failed' };
    }
};

export const getAllDiscreteByProcedure = (procedureId: string) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT d.*, m.*, io.*
                FROM measurement_procedure mp
                INNER JOIN measurement m ON mp.measurement_id = m.mrid
                INNER JOIN discrete d ON d.mrid = m.mrid
                LEFT JOIN identified_object io ON m.mrid = io.mrid
                WHERE mp.procedure_id = ?
            `

            db.all(sql, [procedureId], (err: any, rows: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get all discrete by procedure failed'
                    })
                }
                if (!rows || rows.length === 0) {
                    return resolve({
                        success: false,
                        data: [],
                        message: 'No discrete found'
                    })
                }
                return resolve({
                    success: true,
                    data: rows,
                    message: 'Get all discrete by procedure completed'
                })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get all discrete by procedure failed' }
    }
}

export const insertDiscreteTransaction = async (info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const measurementResult: any = await MeasurementFunc.insertMeasurementTransaction(info, dbsql)
            if (!measurementResult.success) {
                return reject({ success: false, message: 'Insert discrete measurement failed', err: measurementResult.err })
            }
            dbsql.run(
                `INSERT INTO discrete(
                    mrid, max_value, min_value, normal_value, value_alias_set
                ) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    max_value = excluded.max_value,
                    min_value = excluded.min_value,
                    normal_value = excluded.normal_value,
                    value_alias_set = excluded.value_alias_set
                `,
                [
                    info.mrid,
                    info.max_value,
                    info.min_value,
                    info.normal_value,
                    info.value_alias_set
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Insert discrete failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Insert discrete completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert discrete transaction failed' })
        }
    })
}

export const insertDiscrete = async (info: any) => {
    return new Promise(async (resolve, reject) => {
        db.serialize(async () => {
            db.run('BEGIN TRANSACTION');
            try {
                const measurementResult: any = await MeasurementFunc.insertMeasurementTransaction(info, db);
                if (!measurementResult.success) {
                    db.run('ROLLBACK');
                    return reject({ success: false, message: 'Insert discrete measurement failed', err: measurementResult.err });
                }
                db.run(
                    `INSERT INTO discrete(
                        mrid, max_value, min_value, normal_value, value_alias_set
                    ) VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        max_value = excluded.max_value,
                        min_value = excluded.min_value,
                        normal_value = excluded.normal_value,
                        value_alias_set = excluded.value_alias_set
                    `,
                    [
                        info.mrid,
                        info.max_value,
                        info.min_value,
                        info.normal_value,
                        info.value_alias_set
                    ],
                    function (err: any) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject({ success: false, err, message: 'Insert discrete failed' });
                        }
                        db.run('COMMIT');
                        return resolve({ success: true, data: info, message: 'Insert discrete completed' });
                    }
                );
            } catch (err) {
                db.run('ROLLBACK');
                return reject({ success: false, err, message: 'Insert discrete failed' });
            }
        });
    });
}

export const updateDiscreteByIdTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const measurementResult: any = await MeasurementFunc.updateMeasurementByIdTransaction(mrid, info, dbsql)
            if (!measurementResult.success) {
                return reject({ success: false, message: 'Update measurement failed', err: measurementResult.err })
            }
            dbsql.run(
                `UPDATE discrete SET
                    max_value = ?,
                    min_value = ?,
                    normal_value = ?,
                    value_alias_set = ?
                WHERE mrid = ?`,
                [
                    info.max_value,
                    info.min_value,
                    info.normal_value,
                    info.value_alias_set,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update discrete failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update discrete completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update discrete transaction failed' })
        }
    })
}

export const deleteDiscreteByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM discrete WHERE mrid=?", [mrid], function (err: any) {
                if (err) {
                    return reject({ success: false, err, message: 'Delete discrete failed' })
                }
                MeasurementFunc.deleteMeasurementByIdTransaction(mrid, dbsql)
                    .then((measurementResult: any) => {
                        if (!measurementResult.success) {
                            return reject({ success: false, message: 'Delete measurement failed', err: measurementResult.err })
                        }
                        return resolve({ success: true, data: mrid, message: 'Delete discrete completed' })
                    })
                    .catch((error: any) => {
                        return reject({ success: false, err: error, message: 'Delete measurement transaction failed' })
                    });
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete discrete transaction failed' })
        }
    })
}

export const deleteDiscreteById = async (mrid: string) => {
    return new Promise(async (resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run("DELETE FROM discrete WHERE mrid=?", [mrid], function (err: any) {
                if (err) {
                    db.run('ROLLBACK');
                    return reject({ success: false, err, message: 'Delete discrete failed' });
                }
                MeasurementFunc.deleteMeasurementByIdTransaction(mrid, db)
                    .then((measurementResult: any) => {
                        if (!measurementResult.success) {
                            db.run('ROLLBACK');
                            return reject({ success: false, message: 'Delete measurement failed', err: measurementResult.err });
                        }
                        db.run('COMMIT');
                        return resolve({ success: true, data: mrid, message: 'Delete discrete completed' });
                    })
                    .catch((error: any) => {
                        db.run('ROLLBACK');
                        return reject({ success: false, err: error, message: 'Delete measurement transaction failed' });
                    });
            });
        });
    });
}
