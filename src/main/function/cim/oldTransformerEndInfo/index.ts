import db from '../../datacontext/index'
import * as TransformerEndInfoFunc from '../transformerEndInfo/index'

export const getOldTransformerEndInfoById = async (mrid: string) => {
    try {
        const baseResult: any = await TransformerEndInfoFunc.getTransformerEndInfoById(mrid)
        if (!baseResult.success) {
            return { success: false, data: null, message: 'TransformerEndInfo not found' }
        }

        const row: any = await new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM old_transformer_end_info WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => (err ? reject(err) : resolve(row))
            )
        })

        if (!row) {
            return { success: false, data: null, message: 'OldTransformerEndInfo not found' }
        }

        return {
            success: true,
            data: { ...baseResult.data, ...row },
            message: 'Get oldTransformerEndInfo by id completed'
        }

    } catch (err) {
        return { success: false, err, message: 'Get oldTransformerEndInfo by id failed' }
    }
}

export const getOldTransformerEndInfoByPowerTransformerInfoId = async (powerTransformerInfoId: string) => {
    try {
        const rows: any = await new Promise((resolve, reject) => {
            db.all(
                `
                SELECT 
                    *
                FROM old_transformer_end_info otei
                LEFT JOIN transformer_end_info tei ON otei.mrid = tei.mrid
                LEFT JOIN asset_info ai ON tei.mrid = ai.mrid
                LEFT JOIN identified_object i ON ai.mrid = i.mrid

                WHERE otei.power_transformer_info_id = ?
                `,
                [powerTransformerInfoId],
                (err: any, rows: any) => (err ? reject(err) : resolve(rows))
            )
        })

        if (!rows || rows.length === 0) {
            return { success: false, data: [], message: 'No OldTransformerEndInfo found for this powerTransformerInfoId' }
        }
        return {
            success: true,
            data: rows,
            message: 'Get oldTransformerEndInfo by powerTransformerInfoId completed'
        }

    } catch (err) {
        console.error('Error in getOldTransformerEndInfoByPowerTransformerInfoId:', err)
        return { success: false, err, message: 'Get oldTransformerEndInfo by powerTransformerInfoId failed' }
    }
}


export const insertOldTransformerEndInfoTransaction = async (info: any, dbsql: any) => {
    try {
        const baseResult: any = await TransformerEndInfoFunc.insertTransformerEndInfoTransaction(info, dbsql)
        if (!baseResult.success) {
            throw baseResult.err || new Error('Insert transformerEndInfo failed')
        }

        await new Promise((resolve, reject) => {
            dbsql.run(
                `INSERT INTO old_transformer_end_info(
                    mrid, material, spare, accessibility, power_transformer_info_id,
                    phase
                ) VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    material = excluded.material,
                    spare = excluded.spare,
                    accessibility = excluded.accessibility,
                    power_transformer_info_id = excluded.power_transformer_info_id,
                    phase = excluded.phase
                `,
                [
                    info.mrid,
                    info.material,
                    info.spare,
                    info.accessibility,
                    info.power_transformer_info_id,
                    info.phase
                ],
                (err: any) => (err ? reject(err) : resolve(undefined))
            )
        })

        return { success: true, data: info, message: 'Insert oldTransformerEndInfo completed' }

    } catch (err) {
        return { success: false, err, message: 'Insert oldTransformerEndInfo transaction failed' }
    }
}

export const updateOldTransformerEndInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    try {
        const baseResult: any = await TransformerEndInfoFunc.updateTransformerEndInfoTransaction(mrid, info, dbsql)
        if (!baseResult.success) {
            throw baseResult.err || new Error('Update transformerEndInfo failed')
        }

        await new Promise((resolve, reject) => {
            dbsql.run(
                `UPDATE old_transformer_end_info SET
                    material = ?,
                    spare = ?,
                    accessibility = ?,
                    power_transformer_info_id = ?,
                    phase = ?
                WHERE mrid = ?`,
                [
                    info.material,
                    info.spare,
                    info.accessibility,
                    info.power_transformer_info_id,
                    info.phase,
                    mrid
                ],
                (err: any) => (err ? reject(err) : resolve(undefined))
            )
        })

        return { success: true, data: info, message: 'Update oldTransformerEndInfo completed' }

    } catch (err) {
        return { success: false, err, message: 'Update oldTransformerEndInfo transaction failed' }
    }
}

export const deleteOldTransformerEndInfoTransaction = async (mrid: string, dbsql: any) => {
    const deleteOld: any = await new Promise((resolve, reject) => {
        dbsql.run(
            "DELETE FROM old_transformer_end_info WHERE mrid=?",
            [mrid],
            function (this: any, err: any) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });

    if (deleteOld === 0) {
        return {
            success: false,
            data: null,
            message: "Old transformer end info not found"
        };
    }

    const baseResult: any = await TransformerEndInfoFunc.deleteTransformerEndInfoTransaction(mrid, dbsql);
    if (!baseResult.success) {
        throw baseResult.err || new Error("Delete transformerEndInfo failed");
    }

    return {
        success: true,
        data: mrid,
        message: "Delete oldTransformerEndInfo completed"
    };
}
