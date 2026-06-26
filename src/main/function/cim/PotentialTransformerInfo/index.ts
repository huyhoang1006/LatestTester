import db from '../../datacontext/index'
import * as AssetInfoFunc from '../assetInfo/index'

export const getPotentialTransformerInfoById = async (mrid: string) => {
    try {
        const assetInfoResult: any = await AssetInfoFunc.getAssetInfoById(mrid)
        if (!assetInfoResult.success) {
            return { success: false, data: null, message: 'AssetInfo not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM potential_transformer_info WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get potentialTransformerInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'PotentialTransformerInfo not found' })
                    return resolve({ success: true, data: { ...assetInfoResult.data, ...row }, message: 'Get potentialTransformerInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get potentialTransformerInfo by id failed' }
    }
}

export const insertPotentialTransformerTransaction = async (potentialTransformer: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('start insert potential transformer : ' + potentialTransformer);
            const assetInfoResult: any = await AssetInfoFunc.insertAssetInfoTransaction(potentialTransformer, dbsql)
            if (!assetInfoResult.success) {
                return reject({ success: false, message: 'Insert assetInfo failed', err: assetInfoResult.err })
            }
            dbsql.run(
                `INSERT INTO potential_transformer_info(
                    mrid, accuracy_class, nominal_ratio, primary_ratio, pt_class, rated_voltage, secondary_ratio, tertiary_ratio
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    accuracy_class = excluded.accuracy_class,
                    nominal_ratio = excluded.nominal_ratio,
                    primary_ratio = excluded.primary_ratio,
                    pt_class = excluded.pt_class,
                    rated_voltage = excluded.rated_voltage,
                    secondary_ratio = excluded.secondary_ratio,
                    tertiary_ratio = excluded.tertiary_ratio
                `,
                [
                    potentialTransformer.mrid,
                    potentialTransformer.accuracy_class || null,
                    potentialTransformer.nominal_ratio || null,
                    potentialTransformer.primary_ratio || null,
                    potentialTransformer.pt_class || null,
                    potentialTransformer.rated_voltage || null,
                    potentialTransformer.secondary_ratio || null,
                    potentialTransformer.tertiary_ratio || null
                ],
                function (err: any) {
                    if (err) return reject({ success: false, err, message: 'Insert potential transformer failed' })
                    return resolve({ success: true, data: potentialTransformer, message: 'Insert potential transformer completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert potential transformer transaction failed' })
        }
    })
}

export const updatePotentialTransformerInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetInfoResult: any = await AssetInfoFunc.updateAssetInfoTransaction(mrid, info, dbsql)
            if (!assetInfoResult.success) {
                return reject({ success: false, message: 'Update assetInfo failed', err: assetInfoResult.err })
            }
            dbsql.run(
                `UPDATE potential_transformer_info SET
                    accuracy_class = ?,
                    nominal_ratio = ?,
                    primary_ratio = ?,
                    pt_class = ?,
                    rated_voltage = ?,
                    secondary_ratio = ?,
                    tertiary_ratio = ?
                WHERE mrid = ?`,
                [
                    info.accuracy_class,
                    info.nominal_ratio,
                    info.primary_ratio,
                    info.pt_class,
                    info.rated_voltage,
                    info.secondary_ratio,
                    info.tertiary_ratio,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update potentialTransformerInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update potentialTransformerInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update potentialTransformerInfo transaction failed' })
        }
    })
}

export const deletePotentialTransformerInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM potential_transformer_info WHERE mrid=?", [mrid], async function (err: any) {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Delete potentialTransformerInfo failed'
                    });
                }

                try {
                    const assetInfoResult: any = await AssetInfoFunc.deleteAssetInfoByIdTransaction(mrid, dbsql);
                    if (!assetInfoResult.success) {
                        return reject({
                            success: false,
                            message: 'Delete assetInfo failed',
                            err: assetInfoResult.err
                        });
                    }

                    return resolve({
                        success: true,
                        data: mrid,
                        message: 'Delete potentialTransformerInfo + assetInfo completed'
                    });
                } catch (innerErr) {
                    return reject({
                        success: false,
                        err: innerErr,
                        message: 'Delete assetInfo transaction failed'
                    });
                }
            });
        } catch (err) {
            return reject({
                success: false,
                err,
                message: 'Delete potentialTransformerInfo transaction failed'
            });
        }
    });
};
