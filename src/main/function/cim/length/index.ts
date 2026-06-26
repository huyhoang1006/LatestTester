import db from '../../datacontext/index'

export const getLengthById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM length WHERE mrid=?', [mrid], (err: Error | null, row: unknown) => {
            if (err) return reject({ success: false, err: err, message: 'Get length by id failed' })
            if (!row) return resolve({ success: false, data: null, message: 'Length not found' })
            return resolve({ success: true, data: row, message: 'Get length by id completed' })
        })
    })
}

export const getLengthByIds = async (mrids: string[]) => {
    return new Promise((resolve, reject) => {
        if (!mrids || mrids.length === 0) {
            return resolve({ success: false, data: [], message: 'No mrids provided' })
        }

        const placeholders = mrids.map(() => '?').join(',')

        db.all(
            `SELECT * FROM length WHERE mrid IN (${placeholders})`,
            mrids,
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err: err, message: 'Get length by ids failed' })
                if (!rows || rows.length === 0) return resolve({ success: false, data: [], message: 'Length not found' })
                return resolve({ success: true, data: rows, message: 'Get length by ids completed' })
            }
        )
    })
}

export const insertLength = async (length: { mrid: string; multiplier: string | null; unit: string | null; value: number | null }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO length(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [length.mrid, length.multiplier, length.unit, length.value],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert length failed' })
                return resolve({ success: true, data: length, message: 'Insert length completed' })
            }
        )
    })
}

export const insertLengthTransaction = async (
    length: { mrid: string; multiplier: string | null; unit: string | null; value: number | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO length(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [length.mrid, length.multiplier, length.unit, length.value],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert length failed' })
                return resolve({ success: true, data: length, message: 'Insert length completed' })
            }
        )
    })
}

export const updateLengthById = async (mrid: string, length: { multiplier: string | null; unit: string | null; value: number | null }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE length
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [length.multiplier, length.unit, length.value, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update length failed' })
                return resolve({ success: true, data: length, message: 'Update length completed' })
            }
        )
    })
}

export const updateLengthByIdTransaction = async (
    mrid: string,
    length: { multiplier: string | null; unit: string | null; value: number | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE length
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [length.multiplier, length.unit, length.value, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update length failed' })
                return resolve({ success: true, data: length, message: 'Update length completed' })
            }
        )
    })
}

export const deleteLengthById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM length WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete length failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Length not found' })
            return resolve({ success: true, data: null, message: 'Delete length completed' })
        })
    })
}

export const deleteLengthByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM length WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete length failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Length not found' })
            return resolve({ success: true, data: null, message: 'Delete length completed' })
        })
    })
}
