import db from '../../datacontext/index'

export const getBreakerOtherInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM breaker_other_info WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get breakerOtherInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'BreakerOtherInfo not found' })
                return resolve({ success: true, data: row, message: 'Get breakerOtherInfo by id completed' })
            }
        )
    })
}

export const getBreakerOtherInfoByBreakerInfoId = async (breakerInfoId: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM breaker_other_info WHERE breaker_info_id = ?`,
            [breakerInfoId],
            (err: Error | null, rows: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get breakerOtherInfo by breaker_info_id failed' })
                return resolve({ success: true, data: rows, message: 'Get breakerOtherInfo by breaker_info_id completed' })
            }
        )
    })
}

export const insertBreakerOtherInfoTransaction = async (
    info: {
        mrid: string
        breaker_info_id: string
        total_weight_with_gas: string | null
        weight_of_gas: string | null
        rated_gas_pressure: string | null
        rated_gas_temperature: string | null
        volume_of_gas: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO breaker_other_info(
                mrid, breaker_info_id, total_weight_with_gas, weight_of_gas, rated_gas_pressure, rated_gas_temperature, volume_of_gas
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                breaker_info_id = excluded.breaker_info_id,
                total_weight_with_gas = excluded.total_weight_with_gas,
                weight_of_gas = excluded.weight_of_gas,
                rated_gas_pressure = excluded.rated_gas_pressure,
                rated_gas_temperature = excluded.rated_gas_temperature,
                volume_of_gas = excluded.volume_of_gas
            `,
            [
                info.mrid,
                info.breaker_info_id,
                info.total_weight_with_gas,
                info.weight_of_gas,
                info.rated_gas_pressure,
                info.rated_gas_temperature,
                info.volume_of_gas
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert breakerOtherInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert breakerOtherInfo completed' })
            }
        )
    })
}

export const updateBreakerOtherInfoTransaction = async (
    mrid: string,
    info: {
        breaker_info_id: string
        total_weight_with_gas: string | null
        weight_of_gas: string | null
        rated_gas_pressure: string | null
        rated_gas_temperature: string | null
        volume_of_gas: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE breaker_other_info SET
                breaker_info_id = ?,
                total_weight_with_gas = ?,
                weight_of_gas = ?,
                rated_gas_pressure = ?,
                rated_gas_temperature = ?,
                volume_of_gas = ?
            WHERE mrid = ?`,
            [
                info.breaker_info_id,
                info.total_weight_with_gas,
                info.weight_of_gas,
                info.rated_gas_pressure,
                info.rated_gas_temperature,
                info.volume_of_gas,
                mrid
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update breakerOtherInfo failed' })
                return resolve({ success: true, data: info, message: 'Update breakerOtherInfo completed' })
            }
        )
    })
}

export const deleteBreakerOtherInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM breaker_other_info WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete breakerOtherInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete breakerOtherInfo completed' })
        })
    })
}
