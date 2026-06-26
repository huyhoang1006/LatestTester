import db from '../../datacontext/index.js';

export const insertShortCircuitRatingTransaction = async (scr: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO short_circuit_rating (
                mrid,
                power_transformer_info_id,
                short_circuit_current,
                duration_seconds
            ) VALUES (?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                power_transformer_info_id = excluded.power_transformer_info_id,
                short_circuit_current = excluded.short_circuit_current,
                duration_seconds = excluded.duration_seconds`,
            [
                scr.mrid,
                scr.power_transformer_info_id,
                scr.short_circuit_current,
                scr.duration_seconds
            ],
            function(err: any) {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Insert ShortCircuitRating failed'
                    });
                }

                return resolve({
                    success: true,
                    data: scr,
                    message: 'Insert ShortCircuitRating completed'
                });
            }
        );
    });
};

export const updateShortCircuitRatingByIdTransaction = async (mrid: string, scr: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE short_circuit_rating SET
                power_transformer_info_id = ?,
                short_circuit_current = ?,
                duration_seconds = ?
            WHERE mrid = ?`,
            [
                scr.power_transformer_info_id,
                scr.short_circuit_current,
                scr.duration_seconds,
                mrid
            ],
            function(err: any) {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Update ShortCircuitRating failed'
                    });
                }

                return resolve({
                    success: true,
                    data: scr,
                    message: 'Update ShortCircuitRating completed'
                });
            }
        );
    });
};

export const deleteShortCircuitRatingByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(`DELETE FROM short_circuit_rating WHERE mrid = ?`, [mrid], function(err: any) {
            if (err) {
                return reject({
                    success: false,
                    err,
                    message: 'Delete ShortCircuitRating failed'
                });
            }

            return resolve({
                success: true,
                message: 'Delete ShortCircuitRating completed'
            });
        });
    });
};

export const getShortCircuitRatingById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM short_circuit_rating WHERE mrid = ?`,
            [mrid],
            (err: any, row: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get ShortCircuitRating failed'
                    });
                }

                if (!row) {
                    return resolve({
                        success: false,
                        data: null,
                        message: 'ShortCircuitRating not found'
                    });
                }

                return resolve({
                    success: true,
                    data: row,
                    message: 'Get ShortCircuitRating completed'
                });
            }
        );
    });
};

export const getShortCircuitRatingByPowerTransformerInfoId = async (powerTransformerInfoId: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM short_circuit_rating WHERE power_transformer_info_id = ?`,
            [powerTransformerInfoId],
            (err: any, rows: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get ShortCircuitRating by PowerTransformerInfoId failed'
                    });
                }

                if (!rows) {
                    return resolve({
                        success: false,
                        data: null,
                        message: 'No ShortCircuitRating found for this PowerTransformerInfoId'
                    });
                }

                return resolve({
                    success: true,
                    data: rows,
                    message: 'Get ShortCircuitRating by PowerTransformerInfoId completed'
                });
            }
        );
    });
};
