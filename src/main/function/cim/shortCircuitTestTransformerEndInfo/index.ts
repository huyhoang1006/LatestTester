import db from '../../datacontext/index.js';

export const insertSCTTransformerEndInfoTransaction = async (sctEndInfo: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO short_circuit_test_transformer_end_info (
                mrid,
                short_circuit_test_id,
                transformer_end_info_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                short_circuit_test_id = excluded.short_circuit_test_id,
                transformer_end_info_id = excluded.transformer_end_info_id`,
            [
                sctEndInfo.mrid,
                sctEndInfo.short_circuit_test_id,
                sctEndInfo.transformer_end_info_id
            ],
            function(err: any) {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Insert shortCircuitTestTransformerEndInfo failed'
                    });
                }

                return resolve({
                    success: true,
                    data: sctEndInfo,
                    message: 'Insert shortCircuitTestTransformerEndInfo completed'
                });
            }
        );
    });
};

export const updateSCTTransformerEndInfoByIdTransaction = async (mrid: string, sctEndInfo: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE short_circuit_test_transformer_end_info SET
                short_circuit_test_id = ?,
                transformer_end_info_id = ?
            WHERE mrid = ?`,
            [
                sctEndInfo.short_circuit_test_id,
                sctEndInfo.transformer_end_info_id,
                mrid
            ],
            function(err: any) {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Update shortCircuitTestTransformerEndInfo failed'
                    });
                }

                return resolve({
                    success: true,
                    data: sctEndInfo,
                    message: 'Update shortCircuitTestTransformerEndInfo completed'
                });
            }
        );
    });
};

export const deleteSCTTransformerEndInfoByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(`DELETE FROM short_circuit_test_transformer_end_info WHERE mrid = ?`, [mrid], function(err: any) {
            if (err) {
                return reject({
                    success: false,
                    err,
                    message: 'Delete shortCircuitTestTransformerEndInfo failed'
                });
            }

            return resolve({
                success: true,
                message: 'Delete shortCircuitTestTransformerEndInfo completed'
            });
        });
    });
};

export const getSCTTransformerEndInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM short_circuit_test_transformer_end_info WHERE mrid = ?`,
            [mrid],
            (err: any, row: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get shortCircuitTestTransformerEndInfo failed'
                    });
                }

                if (!row) {
                    return resolve({
                        success: false,
                        data: null,
                        message: 'shortCircuitTestTransformerEndInfo not found'
                    });
                }

                resolve({
                    success: true,
                    data: row,
                    message: 'Get shortCircuitTestTransformerEndInfo completed'
                });
            }
        );
    });
};

export const getSCTTransformerEndInfoByShortCircuitTestId = async (shortCircuitTestId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM short_circuit_test_transformer_end_info 
             WHERE short_circuit_test_id = ?`,
            [shortCircuitTestId],
            (err: any, rows: any) => {
                if (err) {
                    return reject({
                        success: false,
                        err,
                        message: 'Get shortCircuitTestTransformerEndInfo by short_circuit_test_id failed'
                    });
                }

                if (!rows || rows.length === 0) {
                    return resolve({
                        success: false,
                        data: [],
                        message: 'No transformer_end_info found for this short_circuit_test_id'
                    });
                }

                return resolve({
                    success: true,
                    data: rows,
                    message: 'Get shortCircuitTestTransformerEndInfo by short_circuit_test_id completed'
                });
            }
        );
    });
};
