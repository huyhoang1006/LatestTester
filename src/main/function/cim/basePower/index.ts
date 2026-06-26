import db from '../../datacontext/index.js'
import * as identifiedObjectFunc from '../identifiedObject/index.js'

export const insertBasePowerTransaction = async (basePower: any, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.insertIdentifiedObjectTransaction(basePower, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({
                        success: false,
                        message: 'Insert identified object failed',
                        err: result.err
                    })
                }

                dbsql.run(
                    `INSERT INTO base_power (
                        mrid,
                        base_power
                    ) VALUES (?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        base_power = excluded.base_power`,
                    [basePower.mrid, basePower.base_power],
                    function (this: { lastID: number; changes: number }, err: Error | null) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert basePower failed' })
                        }
                        return resolve({ success: true, data: basePower, message: 'Insert basePower completed' })
                    }
                )
            })
            .catch((err: Error) => {
                return reject({ success: false, err, message: 'Insert basePower transaction failed' })
            })
    })
}

export const updateBasePowerByIdTransaction = async (mrid: string, basePower: any, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, basePower, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Update identified object failed', err: result.err })
                }

                dbsql.run(
                    `UPDATE base_power SET
                        base_power = ?
                    WHERE mrid = ?`,
                    [basePower.base_power, mrid],
                    function (this: { lastID: number; changes: number }, err: Error | null) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update basePower failed' })
                        }
                        return resolve({ success: true, data: basePower, message: 'Update basePower completed' })
                    }
                )
            })
            .catch((err: Error) => {
                return reject({ success: false, err, message: 'Update basePower transaction failed' })
            })
    })
}

export const deleteBasePowerByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM base_power WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) {
                return reject({ success: false, err, message: 'Delete basePower failed' })
            }
            identifiedObjectFunc
                .deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
                .then((result: any) => resolve(result))
                .catch((err: Error) =>
                    reject({ success: false, err, message: 'Delete identified object failed after basePower delete' })
                )
        })
    })
}

export const getBasePowerById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT bp.*, io.* FROM base_power bp
             LEFT JOIN identified_object io ON bp.mrid = io.mrid
             WHERE bp.mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get basePower failed' })
                if (!row) return resolve({ success: false, data: null, message: 'BasePower not found' })
                return resolve({ success: true, data: row, message: 'Get basePower completed' })
            }
        )
    })
}

export const getBasePowerByIds = async (mrids: string[]) => {
    return new Promise((resolve, reject) => {
        if (!mrids || mrids.length === 0) {
            return resolve({ success: false, data: [], message: 'No mrids provided' })
        }

        const placeholders = mrids.map(() => '?').join(',')

        db.all(
            `SELECT * FROM base_power WHERE mrid IN (${placeholders})`,
            mrids,
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err: err, message: 'Get base power by ids failed' })
                if (!rows || rows.length === 0) return resolve({ success: false, data: [], message: 'Base power not found' })
                return resolve({ success: true, data: rows, message: 'Get base power by ids completed' })
            }
        )
    })
}
