import db from '../../datacontext/index'

export const getPercentById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM percent WHERE mrid=?', [mrid], (err: Error | null, row: unknown) => {
            if (err) return reject({ success: false, err: err, message: 'Get percent by id failed' })
            if (!row) return resolve({ success: false, data: null, message: 'Percent not found' })
            return resolve({ success: true, data: row, message: 'Get percent by id completed' })
        })
    })
}

export const getPercentByIds = async (mrids: string[]) => {
    return new Promise((resolve, reject) => {
        if (!mrids || mrids.length === 0) {
            return resolve({ success: false, data: [], message: 'No mrids provided' })
        }

        const placeholders = mrids.map(() => '?').join(',')

        db.all(
            `SELECT * FROM percent WHERE mrid IN (${placeholders})`,
            mrids,
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err: err, message: 'Get percent by ids failed' })
                if (!rows || rows.length === 0) return resolve({ success: false, data: [], message: 'Percent not found' })
                return resolve({ success: true, data: rows, message: 'Get percent by ids completed' })
            }
        )
    })
}

export const insertPercent = async (percent: { mrid: string; multiplier: string | null; unit: string | null; value: number | null }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO percent(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [percent.mrid, percent.multiplier, percent.unit, percent.value],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert percent failed' })
                return resolve({ success: true, data: percent, message: 'Insert percent completed' })
            }
        )
    })
}

export const insertPercentTransaction = async (
    percent: { mrid: string; multiplier: string | null; unit: string | null; value: number | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO percent(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [percent.mrid, percent.multiplier, percent.unit, percent.value],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert percent failed' })
                return resolve({ success: true, data: percent, message: 'Insert percent completed' })
            }
        )
    })
}

export const updatePercentById = async (mrid: string, percent: { multiplier: string | null; unit: string | null; value: number | null }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE percent
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [percent.multiplier, percent.unit, percent.value, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update percent failed' })
                return resolve({ success: true, data: percent, message: 'Update percent completed' })
            }
        )
    })
}

export const updatePercentByIdTransaction = async (
    mrid: string,
    percent: { multiplier: string | null; unit: string | null; value: number | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE percent
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [percent.multiplier, percent.unit, percent.value, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update percent failed' })
                return resolve({ success: true, data: percent, message: 'Update percent completed' })
            }
        )
    })
}

export const deletePercentById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM percent WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete percent failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Percent not found' })
            return resolve({ success: true, data: null, message: 'Delete percent completed' })
        })
    })
}

export const deletePercentByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM percent WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete percent failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Percent not found' })
            return resolve({ success: true, data: null, message: 'Delete percent completed' })
        })
    })
}
