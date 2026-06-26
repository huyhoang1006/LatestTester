import db from '../../datacontext/index'

export const getAssetPsrById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM asset_psr WHERE mrid=?", [mrid], (err: any, row: any) => {
            if (err) return reject({ success: false, err: err, message: 'Get assetPsr by id failed' })
            if (!row) return resolve({ success: false, data: null, message: 'AssetPsr not found' })
            return resolve({ success: true, data: row, message: 'Get assetPsr by id completed' })
        })
    })
}

export const getAssetPsrByAssetIdAndPsrId = async (assetId: string, psrId: string) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM asset_psr WHERE asset_id=? AND psr_id=?", [assetId, psrId], (err: any, row: any) => {
            if (err) return reject({ success: false, err: err, message: 'Get assetPsr by assetId and psrId failed' })
            if (!row) return resolve({ success: false, data: null, message: 'AssetPsr not found' })
            return resolve({ success: true, data: row, message: 'Get assetPsr by assetId completed' })
        })
    })
}

export const insertAssetPsr = async (data: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            db.run(
                `INSERT INTO asset_psr(
                    mrid, asset_id, psr_id
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    asset_id = excluded.asset_id,
                    psr_id = excluded.psr_id
                `,
                [
                    data.mrid,
                    data.asset_id,
                    data.psr_id
                ],
                function (err: any) {
                    if (err) {
                        db.run('ROLLBACK')
                        return reject({ success: false, err: err, message: 'Insert assetPsr failed' })
                    }
                    db.run('COMMIT')
                    return resolve({ success: true, data: data, message: 'Insert assetPsr completed' })
                }
            )
        })
    })
}

export const insertAssetPsrTransaction = (data: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        if (!data || !data.mrid || !data.asset_id || !data.psr_id) {
            return reject({
                success: false,
                err: new Error('Missing required fields: mrid, asset_id, or psr_id'),
                message: 'Insert assetPsr transaction failed - missing required fields'
            })
        }

        dbsql.run(
            `INSERT INTO asset_psr(
                mrid, asset_id, psr_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                asset_id = excluded.asset_id,
                psr_id = excluded.psr_id
            `,
            [
                data.mrid,
                data.asset_id,
                data.psr_id
            ],
            function (err: any) {
                if (err) {
                    console.error('AssetPsr insert error:', err)
                    console.error('AssetPsr data:', data)
                    return reject({ success: false, err: err, message: 'Insert assetPsr transaction failed' })
                }
                return resolve({ success: true, data: data, message: 'Insert assetPsr transaction completed' })
            }
        )
    })
}

export const updateAssetPsr = async (mrid: string, data: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            db.run(
                `UPDATE asset_psr SET
                    asset_id = ?,
                    psr_id = ?
                WHERE mrid = ?`,
                [
                    data.asset_id,
                    data.psr_id,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        db.run('ROLLBACK')
                        return reject({ success: false, err: err, message: 'Update assetPsr failed' })
                    }
                    db.run('COMMIT')
                    return resolve({ success: true, data: data, message: 'Update assetPsr completed' })
                }
            )
        })
    })
}

export const updateAssetPsrTransaction = (mrid: string, data: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE asset_psr SET
                asset_id = ?,
                psr_id = ?
            WHERE mrid = ?`,
            [
                data.asset_id,
                data.psr_id,
                mrid
            ],
            function (err: any) {
                if (err) {
                    return reject({ success: false, err: err, message: 'Update assetPsr transaction failed' })
                }
                return resolve({ success: true, data: data, message: 'Update assetPsr transaction completed' })
            }
        )
    })
}

export const deleteAssetPsrById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM asset_psr WHERE mrid=?", [mrid], function (err: any) {
            if (err) {
                return reject({ success: false, err: err, message: 'Delete assetPsr failed' })
            }
            return resolve({ success: true, data: mrid, message: 'Delete assetPsr completed' })
        })
    })
}

export const deleteAssetPsrByIdTransaction = (mrid: string, dbsql: any) => {
    return deleteAssetPsrTransaction(mrid, dbsql)
}

export const deleteAssetPsrTransaction = (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run("DELETE FROM asset_psr WHERE mrid=?", [mrid], function (err: any) {
            if (err) {
                return reject({ success: false, err: err, message: 'Delete assetPsr transaction failed' })
            }
            return resolve({ success: true, data: mrid, message: 'Delete assetPsr transaction completed' })
        })
    })
}
