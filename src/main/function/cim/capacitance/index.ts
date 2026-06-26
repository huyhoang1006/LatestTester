import db from '../../datacontext/index'

export const getCapacitanceById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM capacitance WHERE mrid=?',
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get capacitance by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'Capacitance not found' })
                return resolve({ success: true, data: row, message: 'Get capacitance by id completed' })
            }
        )
    })
}

export const getCapacitanceByIds = async (mrids: string[]) => {
    return new Promise((resolve, reject) => {
        if (!mrids || mrids.length === 0) {
            return resolve({ success: false, data: [], message: 'No mrids provided' })
        }

        const placeholders = mrids.map(() => '?').join(',')

        db.all(
            `SELECT * FROM capacitance WHERE mrid IN (${placeholders})`,
            mrids,
            (err: Error | null, rows: unknown[]) => {
                if (err) {
                    return reject({ success: false, err: err, message: 'Get capacitances by ids failed' })
                }
                if (!rows || rows.length === 0) {
                    return resolve({ success: false, data: [], message: 'Capacitances not found' })
                }
                return resolve({ success: true, data: rows, message: 'Get capacitances by ids completed' })
            }
        )
    })
}

export const insertCapacitanceTransaction = async (
    capacitance: { mrid: string; multiplier: string | null; unit: string | null; value: number | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO capacitance(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [capacitance.mrid, capacitance.multiplier, capacitance.unit, capacitance.value],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert capacitance failed' })
                return resolve({ success: true, data: capacitance, message: 'Insert capacitance completed' })
            }
        )
    })
}

export const updateCapacitanceByIdTransaction = async (
    mrid: string,
    capacitance: { multiplier: string | null; unit: string | null; value: number | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE capacitance
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [capacitance.multiplier, capacitance.unit, capacitance.value, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update capacitance failed' })
                return resolve({ success: true, data: capacitance, message: 'Update capacitance completed' })
            }
        )
    })
}

export const deleteCapacitanceByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM capacitance WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete capacitance failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Capacitance not found' })
            return resolve({ success: true, data: null, message: 'Delete capacitance completed' })
        })
    })
}
