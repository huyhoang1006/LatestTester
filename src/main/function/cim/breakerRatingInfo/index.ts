import db from '../../datacontext/index'

export const getBreakerRatingInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM breaker_rating_info WHERE mrid=?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get breakerRatingInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'BreakerRatingInfo not found' })
                return resolve({ success: true, data: row, message: 'Get breakerRatingInfo by id completed' })
            }
        )
    })
}

export const getBreakerRatingInfoByBreakerInfoId = async (breakerInfoId: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM breaker_rating_info WHERE breaker_info_id=?`,
            [breakerInfoId],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get breakerRatingInfo by breakerInfoId failed' })
                if (!row) return resolve({ success: false, data: null, message: 'BreakerRatingInfo not found' })
                return resolve({ success: true, data: row, message: 'Get breakerRatingInfo by breakerInfoId completed' })
            }
        )
    })
}

export const insertBreakerRatingInfoTransaction = async (
    info: {
        mrid: string
        breaker_info_id: string
        rated_short_circuit_breaking_current: string | null
        short_circuit_nominal_duration: string | null
        rated_insulation_level: string | null
        interrupting_duty_cycle: string | null
        rated_power_closing: string | null
        rated_power_opening: string | null
        rated_power_motor_charge: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO breaker_rating_info(
                mrid, breaker_info_id, rated_short_circuit_breaking_current, short_circuit_nominal_duration,
                rated_insulation_level, interrupting_duty_cycle, rated_power_closing, rated_power_opening, rated_power_motor_charge
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                breaker_info_id = excluded.breaker_info_id,
                rated_short_circuit_breaking_current = excluded.rated_short_circuit_breaking_current,
                short_circuit_nominal_duration = excluded.short_circuit_nominal_duration,
                rated_insulation_level = excluded.rated_insulation_level,
                interrupting_duty_cycle = excluded.interrupting_duty_cycle,
                rated_power_closing = excluded.rated_power_closing,
                rated_power_opening = excluded.rated_power_opening,
                rated_power_motor_charge = excluded.rated_power_motor_charge
            `,
            [
                info.mrid,
                info.breaker_info_id,
                info.rated_short_circuit_breaking_current,
                info.short_circuit_nominal_duration,
                info.rated_insulation_level,
                info.interrupting_duty_cycle,
                info.rated_power_closing,
                info.rated_power_opening,
                info.rated_power_motor_charge
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert breakerRatingInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert breakerRatingInfo completed' })
            }
        )
    })
}

export const updateBreakerRatingInfoTransaction = async (
    mrid: string,
    info: {
        breaker_info_id: string
        rated_short_circuit_breaking_current: string | null
        short_circuit_nominal_duration: string | null
        rated_insulation_level: string | null
        interrupting_duty_cycle: string | null
        rated_power_closing: string | null
        rated_power_opening: string | null
        rated_power_motor_charge: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE breaker_rating_info SET
                breaker_info_id = ?,
                rated_short_circuit_breaking_current = ?,
                short_circuit_nominal_duration = ?,
                rated_insulation_level = ?,
                interrupting_duty_cycle = ?,
                rated_power_closing = ?,
                rated_power_opening = ?,
                rated_power_motor_charge = ?
            WHERE mrid = ?`,
            [
                info.breaker_info_id,
                info.rated_short_circuit_breaking_current,
                info.short_circuit_nominal_duration,
                info.rated_insulation_level,
                info.interrupting_duty_cycle,
                info.rated_power_closing,
                info.rated_power_opening,
                info.rated_power_motor_charge,
                mrid
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update breakerRatingInfo failed' })
                return resolve({ success: true, data: info, message: 'Update breakerRatingInfo completed' })
            }
        )
    })
}

export const deleteBreakerRatingInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM breaker_rating_info WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete breakerRatingInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete breakerRatingInfo completed' })
        })
    })
}
