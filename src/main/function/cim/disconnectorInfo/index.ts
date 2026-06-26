import db from '../../datacontext/index'
import * as OldSwitchInfoFunc from '../oldSwitchInfo/index.js'

export const getDisconnectorInfoById = async (mrid: string) => {
    try {
        const switchInfoResult: any = await OldSwitchInfoFunc.getOldSwitchInfoById(mrid)
        if (!switchInfoResult.success) {
            return { success: false, data: null, message: 'OldSwitchInfo not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM disconnector_info WHERE mrid=?`,
                [mrid],
                (err: Error | null, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get disconnectorInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'DisconnectorInfo not found' })
                    return resolve({ success: true, data: { ...switchInfoResult.data, ...row }, message: 'Get disconnectorInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get disconnectorInfo by id failed' }
    }
}

export const insertDisconnectorInfoTransaction = async (
    info: { mrid: string; rated_duration_short_circuit: string | null; withstand_voltage_earth_poles: string | null; power_frequency_isolating_distance: string | null },
    dbsql: any
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const switchInfoResult: any = await OldSwitchInfoFunc.insertOldSwitchInfoTransaction(info, dbsql)
            if (!switchInfoResult.success) {
                return reject({ success: false, message: 'Insert OldSwitchInfo failed', err: switchInfoResult.err })
            }
            dbsql.run(
                `INSERT INTO disconnector_info(
                    mrid, rated_duration_short_circuit, withstand_voltage_earth_poles, power_frequency_isolating_distance
                ) VALUES (?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    rated_duration_short_circuit = excluded.rated_duration_short_circuit,
                    withstand_voltage_earth_poles = excluded.withstand_voltage_earth_poles,
                    power_frequency_isolating_distance = excluded.power_frequency_isolating_distance
                `,
                [info.mrid, info.rated_duration_short_circuit, info.withstand_voltage_earth_poles, info.power_frequency_isolating_distance],
                function (this: { lastID: number; changes: number }, err: Error | null) {
                    if (err) {
                        return reject({ success: false, err, message: 'Insert disconnectorInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Insert disconnectorInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert disconnectorInfo transaction failed' })
        }
    })
}

export const updateDisconnectorInfoTransaction = async (
    mrid: string,
    info: { rated_duration_short_circuit: string | null; withstand_voltage_earth_poles: string | null; power_frequency_isolating_distance: string | null },
    dbsql: any
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const switchInfoResult: any = await OldSwitchInfoFunc.updateOldSwitchInfoTransaction(mrid, info, dbsql)
            if (!switchInfoResult.success) {
                return reject({ success: false, message: 'Update OldSwitchInfo failed', err: switchInfoResult.err })
            }
            dbsql.run(
                `UPDATE disconnector_info SET
                    rated_duration_short_circuit = ?,
                    withstand_voltage_earth_poles = ?,
                    power_frequency_isolating_distance = ?
                WHERE mrid = ?`,
                [info.rated_duration_short_circuit, info.withstand_voltage_earth_poles, info.power_frequency_isolating_distance, mrid],
                function (this: { lastID: number; changes: number }, err: Error | null) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update disconnectorInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update disconnectorInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update disconnectorInfo transaction failed' })
        }
    })
}

export const deleteDisconnectorInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        try {
            const switchInfoResult: any = OldSwitchInfoFunc.deleteOldSwitchInfoTransaction(mrid, dbsql)
            if (!switchInfoResult.success) {
                return reject({ success: false, message: 'Delete OldSwitchInfo failed', err: switchInfoResult.err })
            }
            dbsql.run('DELETE FROM disconnector_info WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) {
                    return reject({ success: false, err, message: 'Delete disconnectorInfo failed' })
                }
                return resolve({ success: true, data: mrid, message: 'Delete disconnectorInfo completed' })
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete disconnectorInfo transaction failed' })
        }
    })
}
