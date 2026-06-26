import db from '../../datacontext/index'
import * as BreakerInfoFunc from '../breakerInfo/index'

export const getOldBreakerInfoById = async (mrid: string) => {
    try {
        const breakerInfoResult: any = await BreakerInfoFunc.getBreakerInfoById(mrid)
        if (!breakerInfoResult.success) {
            return { success: false, data: null, message: 'BreakerInfo not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM old_breaker_info WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get oldBreakerInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'OldBreakerInfo not found' })
                    return resolve({ success: true, data: { ...breakerInfoResult.data, ...row }, message: 'Get oldBreakerInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get oldBreakerInfo by id failed' }
    }
}

export const insertOldBreakerInfoTransaction = async (info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const breakerInfoResult: any = await BreakerInfoFunc.insertBreakerInfoTransaction(info, dbsql)
            if (!breakerInfoResult.success) {
                return reject({ success: false, message: 'Insert BreakerInfo failed', err: breakerInfoResult.err })
            }
            dbsql.run(
                `INSERT INTO old_breaker_info(
                    mrid,
                    phase_number,
                    number_of_interrupters_per_phase,
                    pole_operation,
                    pir,
                    pir_value,
                    grading_capacitors,
                    capacitor_value,
                    interrupting_medium,
                    tank_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    phase_number = excluded.phase_number,
                    number_of_interrupters_per_phase = excluded.number_of_interrupters_per_phase,
                    pole_operation = excluded.pole_operation,
                    pir = excluded.pir,
                    pir_value = excluded.pir_value,
                    grading_capacitors = excluded.grading_capacitors,
                    capacitor_value = excluded.capacitor_value,
                    interrupting_medium = excluded.interrupting_medium,
                    tank_type = excluded.tank_type
                `,
                [
                    info.mrid,
                    info.phase_number,
                    info.number_of_interrupters_per_phase,
                    info.pole_operation,
                    info.pir,
                    info.pir_value,
                    info.grading_capacitors,
                    info.capacitor_value,
                    info.interrupting_medium,
                    info.tank_type
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Insert oldBreakerInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Insert oldBreakerInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert oldBreakerInfo transaction failed' })
        }
    })
}

export const updateOldBreakerInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const breakerInfoResult: any = await BreakerInfoFunc.updateBreakerInfoTransaction(mrid, info, dbsql)
            if (!breakerInfoResult.success) {
                return reject({ success: false, message: 'Update BreakerInfo failed', err: breakerInfoResult.err })
            }
            dbsql.run(
                `UPDATE old_breaker_info SET
                    phase_number = ?,
                    number_of_interrupters_per_phase = ?,
                    pole_operation = ?,
                    pir = ?,
                    pir_value = ?,
                    grading_capacitors = ?,
                    capacitor_value = ?,
                    interrupting_medium = ?,
                    tank_type = ?
                WHERE mrid = ?`,
                [
                    info.phase_number,
                    info.number_of_interrupters_per_phase,
                    info.pole_operation,
                    info.pir,
                    info.pir_value,
                    info.grading_capacitors,
                    info.capacitor_value,
                    info.interrupting_medium,
                    info.tank_type,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update oldBreakerInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update oldBreakerInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update oldBreakerInfo transaction failed' })
        }
    })
}

export const deleteOldBreakerInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM old_breaker_info WHERE mrid=?", [mrid], function (err: any) {
                if (err) return reject({ success: false, err, message: 'Delete oldBreakerInfo failed' })

                BreakerInfoFunc.deleteBreakerInfoTransaction(mrid, dbsql)
                    .then((breakerRes: any) => {
                        if (!breakerRes.success) {
                            return reject({ success: false, message: 'Delete BreakerInfo failed', err: breakerRes.err })
                        }
                        return resolve({ success: true, data: mrid, message: 'Delete oldBreakerInfo completed' })
                    })
                    .catch((err2: any) => {
                        return reject({ success: false, err: err2, message: 'Delete BreakerInfo transaction failed' })
                    })
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete oldBreakerInfo transaction failed' })
        }
    })
}
