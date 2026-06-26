import db from '../../datacontext/index'

export const getZeroSequenceImpedanceById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM zero_sequence_impedance WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get zero sequence impedance failed' })
                if (!row) return resolve({ success: false, data: null, message: 'Not found' })
                return resolve({ success: true, data: row, message: 'Completed' })
            }
        )
    })
}

export const insertZeroSequenceImpedanceTransaction = async (
    info: { mrid: string; power_transformer_info_id: string; base_power: string | null; base_voltage: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO zero_sequence_impedance(
                mrid, power_transformer_info_id, base_power, base_voltage
            ) VALUES (?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                power_transformer_info_id = excluded.power_transformer_info_id,
                base_power = excluded.base_power,
                base_voltage = excluded.base_voltage`,
            [info.mrid, info.power_transformer_info_id, info.base_power, info.base_voltage],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert/Update zero sequence impedance failed' })
                return resolve({ success: true, data: info, message: 'Upsert completed' })
            }
        )
    })
}

export const updateZeroSequenceImpedanceTransaction = async (
    mrid: string,
    info: { power_transformer_info_id: string; base_power: string | null; base_voltage: string | null },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO zero_sequence_impedance(
                mrid, power_transformer_info_id, base_power, base_voltage
            ) VALUES (?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                power_transformer_info_id = excluded.power_transformer_info_id,
                base_power = excluded.base_power,
                base_voltage = excluded.base_voltage`,
            [mrid, info.power_transformer_info_id, info.base_power, info.base_voltage],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Upsert zero sequence impedance failed' })
                return resolve({ success: true, data: info, message: 'Upsert completed' })
            }
        )
    })
}

export const getZeroSequenceImpedanceByTransformerInfoId = async (powerTransformerInfoId: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT *
             FROM zero_sequence_impedance
             WHERE power_transformer_info_id = ?`,
            [powerTransformerInfoId],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Query failed' })
                return resolve({ success: true, data: row, message: 'Completed' })
            }
        )
    })
}

export const deleteZeroSequenceImpedanceTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `DELETE FROM zero_sequence_impedance WHERE mrid = ?`,
            [mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Delete zero sequence impedance failed' })
                return resolve({ success: true, data: mrid, message: 'Delete completed' })
            }
        )
    })
}
