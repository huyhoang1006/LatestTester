import db from '../../datacontext/index'

export const getProcedureAssetById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM procedure_asset WHERE mrid=?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get procedure asset by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'procedure asset not found' })
                return resolve({ success: true, data: row, message: 'Get procedure asset by id completed' })
            }
        )
    })
}

export const insertProcedureAssetTransaction = async (info: { procedure_id: string; asset_id: string }, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO procedure_asset (
                procedure_id, asset_id
            ) VALUES (?, ?)
            ON CONFLICT(procedure_id, asset_id) DO NOTHING`,
            [info.procedure_id, info.asset_id],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) {
                    return reject({ success: false, err, message: 'Insert ProcedureAsset failed' })
                }
                return resolve({ success: true, data: info, message: 'Insert ProcedureAsset completed' })
            }
        )
    })
}

export const updateProcedureAssetTransaction = async (mrid: string, info: { procedure_id: string; asset_id: string }, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE procedure_asset SET
                procedure_id = ?,
                asset_id = ?
            WHERE mrid = ?`,
            [info.procedure_id, info.asset_id, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) {
                    return reject({ success: false, err, message: 'Update ProcedureAsset failed' })
                }
                return resolve({ success: true, data: info, message: 'Update ProcedureAsset completed' })
            }
        )
    })
}

export const deleteProcedureAssetTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM procedure_asset WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) {
                return reject({ success: false, err, message: 'Delete ProcedureAsset failed' })
            }
            return resolve({ success: true, data: mrid, message: 'Delete ProcedureAsset completed' })
        })
    })
}
