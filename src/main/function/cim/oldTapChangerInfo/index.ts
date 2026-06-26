import db from '../../datacontext/index'
import * as TapChangerInfoFunc from '../tapChangerInfo/index'

export const getOldTapChangerInfoById = async (mrid: string) => {
    try {
        const parentResult: any = await TapChangerInfoFunc.getTapChangerInfoById(mrid)
        if (!parentResult.success) {
            return { success: false, data: null, message: 'TapChangerInfo not found' }
        }

        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM old_tap_changer_info WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get oldTapChangerInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'OldTapChangerInfo specific data not found' })

                    return resolve({ success: true, data: { ...parentResult.data, ...row }, message: 'Get oldTapChangerInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get oldTapChangerInfo by id failed' }
    }
}

export const getOldTapChangerInfoByPowerTransformerInfoId = async (powerTransformerInfoId: string) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT mrid FROM old_tap_changer_info WHERE power_transformer_info_id=?`,
                [powerTransformerInfoId],
                async (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Find OldTapChangerInfo mrid failed' })

                    if (!row) return resolve({ success: false, data: null, message: 'OldTapChangerInfo not found for this transformer' })

                    try {
                        const result: any = await getOldTapChangerInfoById(row.mrid);
                        return resolve(result);
                    } catch (error) {
                        return reject(error);
                    }
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get OldTapChangerInfo by PowerTransformerInfoId failed' }
    }
}

export const insertOldTapChangerInfoTransaction = async (info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parentResult: any = await TapChangerInfoFunc.insertTapChangerInfoTransaction(info, dbsql)
            if (!parentResult.success) {
                return reject({ success: false, message: 'Insert TapChangerInfo failed', err: parentResult.err })
            }

            dbsql.run(
                `INSERT INTO old_tap_changer_info(
                    mrid, tap_scheme, number_of_tap, power_transformer_info_id, transformer_end_info
                ) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    tap_scheme = excluded.tap_scheme,
                    number_of_tap = excluded.number_of_tap,
                    power_transformer_info_id = excluded.power_transformer_info_id,
                    transformer_end_info = excluded.transformer_end_info
                `,
                [
                    info.mrid,
                    info.tap_scheme,
                    info.number_of_tap,
                    info.power_transformer_info_id,
                    info.transformer_end_info
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Insert oldTapChangerInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Insert oldTapChangerInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert oldTapChangerInfo transaction failed' })
        }
    })
}

export const updateOldTapChangerInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parentResult: any = await TapChangerInfoFunc.updateTapChangerInfoTransaction(mrid, info, dbsql)
            if (!parentResult.success) {
                return reject({ success: false, message: 'Update TapChangerInfo failed', err: parentResult.err })
            }

            dbsql.run(
                `UPDATE old_tap_changer_info SET
                    tap_scheme = ?,
                    number_of_tap = ?,
                    power_transformer_info_id = ?,
                    transformer_end_info = ?
                WHERE mrid = ?`,
                [
                    info.tap_scheme,
                    info.number_of_tap,
                    info.power_transformer_info_id,
                    info.transformer_end_info,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update oldTapChangerInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update oldTapChangerInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update oldTapChangerInfo transaction failed' })
        }
    })
}

export const deleteOldTapChangerInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            await new Promise((res, rej) => {
                dbsql.run("DELETE FROM old_tap_changer_info WHERE mrid=?", [mrid], function (err: any) {
                    if (err) return rej({ success: false, err, message: 'Delete oldTapChangerInfo table failed' });
                    res(undefined);
                });
            });

            const parentResult: any = await TapChangerInfoFunc.deleteTapChangerInfoTransaction(mrid, dbsql);

            if (!parentResult.success) {
                return reject({ success: false, message: 'Delete TapChangerInfo parent failed', err: parentResult.err });
            }

            return resolve({ success: true, data: mrid, message: 'Delete oldTapChangerInfo completed' });
        } catch (err) {
            return reject({ success: false, err, message: 'Delete oldTapChangerInfo transaction failed' });
        }
    })
}
