import db from '../../datacontext/index'

export const getIeeeStandardById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM ieeeStandard WHERE mrid=?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get ieeeStandard by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'IeeeStandard not found' })
                return resolve({ success: true, data: row, message: 'Get ieeeStandard by id completed' })
            }
        )
    })
}

export const insertIeeeStandardTransaction = async (
    ieeeStandard: { mrid: string; standard_edition: string; standard_number: string },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO ieeeStandard(
                mrid, standard_edition, standard_number
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                standard_edition = excluded.standard_edition,
                standard_number = excluded.standard_number
            `,
            [ieeeStandard.mrid, ieeeStandard.standard_edition, ieeeStandard.standard_number],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert ieeeStandard failed' })
                return resolve({ success: true, data: ieeeStandard, message: 'Insert ieeeStandard completed' })
            }
        )
    })
}

export const updateIeeeStandardByIdTransaction = async (
    mrid: string,
    ieeeStandard: { standard_edition: string; standard_number: string },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE ieeeStandard SET
                standard_edition = ?,
                standard_number = ?
            WHERE mrid = ?`,
            [ieeeStandard.standard_edition, ieeeStandard.standard_number, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update ieeeStandard failed' })
                return resolve({ success: true, data: ieeeStandard, message: 'Update ieeeStandard completed' })
            }
        )
    })
}

export const deleteIeeeStandardByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM ieeeStandard WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) {
                return reject({ success: false, err, message: 'Delete ieeeStandard failed' })
            }
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'IeeeStandard not found' })
            return resolve({ success: true, data: null, message: 'Delete ieeeStandard completed' })
        })
    })
}
