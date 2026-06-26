import db from '../../datacontext/index'
import * as PotentialTransformerInfoFunc from '../PotentialTransformerInfo/index'

export const getOldPotentialTransformerInfoById = async (mrid: string) => {
    try {
        const ptInfoResult: any = await PotentialTransformerInfoFunc.getPotentialTransformerInfoById(mrid)
        if (!ptInfoResult.success) {
            return { success: false, data: null, message: 'PotentialTransformerInfo not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM old_potential_transformer_info WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get oldPotentialTransformerInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'OldPotentialTransformerInfo not found' })
                    return resolve({ success: true, data: { ...ptInfoResult.data, ...row }, message: 'Get oldPotentialTransformerInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get oldPotentialTransformerInfo by id failed' }
    }
}

export const insertOldPotentialTransformerTransaction = async (info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ptInfoResult: any = await PotentialTransformerInfoFunc.insertPotentialTransformerTransaction(info, dbsql)
            if (!ptInfoResult.success) {
                return reject({ success: false, message: 'Insert potentialTransformerInfo failed', err: ptInfoResult.err })
            }
            dbsql.run(
                `INSERT INTO old_potential_transformer_info(
                    mrid, standard, rated_frequency, upr_formula, windings, c1, c2
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    standard = excluded.standard,
                    rated_frequency = excluded.rated_frequency,
                    upr_formula = excluded.upr_formula,
                    windings = excluded.windings,
                    c1 = excluded.c1,
                    c2 = excluded.c2
                `,
                [
                    info.mrid,
                    info.standard,
                    info.rated_frequency,
                    info.upr_formula,
                    info.windings,
                    info.c1,
                    info.c2
                ],
                function (err: any) {
                    if (err) return reject({ success: false, err, message: 'Insert oldPotentialTransformerInfo failed' })
                    return resolve({ success: true, data: info, message: 'Insert oldPotentialTransformerInfo completed' })
                }
            )
        } catch (error) {
            return reject({ success: false, err: error, message: 'Insert oldPotentialTransformerInfo transaction failed' })
        }
    })
}

export const updateOldPotentialTransformerInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ptInfoResult: any = await PotentialTransformerInfoFunc.updatePotentialTransformerInfoTransaction(mrid, info, dbsql)
            if (!ptInfoResult.success) {
                return reject({ success: false, message: 'Update potentialTransformerInfo failed', err: ptInfoResult.err })
            }
            dbsql.run(
                `UPDATE old_potential_transformer_info SET
                    standard = ?,
                    rated_frequency = ?,
                    upr_formula = ?,
                    windings = ?,
                    c1 = ?,
                    c2 = ?
                WHERE mrid = ?`,
                [
                    info.standard,
                    info.rated_frequency,
                    info.upr_formula,
                    info.windings,
                    info.c1,
                    info.c2,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update oldPotentialTransformerInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update oldPotentialTransformerInfo completed' })
                }
            )
        } catch (error) {
            return reject({ success: false, err: error, message: 'Update oldPotentialTransformerInfo transaction failed' })
        }
    })
}

export const deleteOldPotentialTransformerInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM old_potential_transformer_info WHERE mrid=?", [mrid], async function (err: any) {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Delete oldPotentialTransformerInfo failed'
                    });
                }

                try {
                    const ptInfoResult: any = await PotentialTransformerInfoFunc.deletePotentialTransformerInfoTransaction(mrid, dbsql);
                    if (!ptInfoResult.success) {
                        return reject({
                            success: false,
                            message: 'Delete potentialTransformerInfo failed',
                            err: ptInfoResult.err
                        });
                    }

                    return resolve({
                        success: true,
                        data: mrid,
                        message: 'Delete oldPotentialTransformerInfo + potentialTransformerInfo completed'
                    });
                } catch (innerErr) {
                    return reject({
                        success: false,
                        err: innerErr,
                        message: 'Delete potentialTransformerInfo transaction failed'
                    });
                }
            });
        } catch (error) {
            return reject({
                success: false,
                err: error,
                message: 'Delete oldPotentialTransformerInfo transaction failed'
            });
        }
    });
};
