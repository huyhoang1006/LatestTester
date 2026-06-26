import db from '../../datacontext/index'
import * as AssetInfoFunc from '../assetInfo/index'

export const getOperatingMechanismInfoById = async (mrid: string) => {
    try {
        const parentRes: any = await AssetInfoFunc.getAssetInfoById(mrid)
        if (!parentRes.success) return { success: false, data: null, message: 'AssetInfo not found' }

        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM operating_mechanism_info WHERE mrid = ?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get operatingMechanismInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'OperatingMechanismInfo not found' })
                    return resolve({ success: true, data: { ...parentRes.data, ...row }, message: 'Get operatingMechanismInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get operatingMechanismInfo by id failed' }
    }
}

export const insertOperatingMechanismInfoTransaction = async (info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parentRes: any = await AssetInfoFunc.insertAssetInfoTransaction(info, dbsql)
            if (!parentRes.success) return reject({ success: false, message: 'Insert AssetInfo failed', err: parentRes.err })

            dbsql.run(
                `INSERT INTO operating_mechanism_info(
                    mrid, close_amps, close_voltage, mechanism_kind,
                    motor_run_current, motor_start_current, motor_voltage,
                    trip_amps, trip_voltage
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    close_amps = excluded.close_amps,
                    close_voltage = excluded.close_voltage,
                    mechanism_kind = excluded.mechanism_kind,
                    motor_run_current = excluded.motor_run_current,
                    motor_start_current = excluded.motor_start_current,
                    motor_voltage = excluded.motor_voltage,
                    trip_amps = excluded.trip_amps,
                    trip_voltage = excluded.trip_voltage
                `,
                [
                    info.mrid,
                    info.close_amps,
                    info.close_voltage,
                    info.mechanism_kind,
                    info.motor_run_current,
                    info.motor_start_current,
                    info.motor_voltage,
                    info.trip_amps,
                    info.trip_voltage
                ],
                function (err: any) {
                    if (err) return reject({ success: false, err, message: 'Insert operatingMechanismInfo failed' })
                    return resolve({ success: true, data: info, message: 'Insert operatingMechanismInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert operatingMechanismInfo transaction failed' })
        }
    })
}

export const updateOperatingMechanismInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parentRes: any = await AssetInfoFunc.updateAssetInfoTransaction(mrid, info, dbsql)
            if (!parentRes.success) return reject({ success: false, message: 'Update AssetInfo failed', err: parentRes.err })

            dbsql.run(
                `UPDATE operating_mechanism_info SET
                    close_amps = ?,
                    close_voltage = ?,
                    mechanism_kind = ?,
                    motor_run_current = ?,
                    motor_start_current = ?,
                    motor_voltage = ?,
                    trip_amps = ?,
                    trip_voltage = ?
                WHERE mrid = ?`,
                [
                    info.close_amps,
                    info.close_voltage,
                    info.mechanism_kind,
                    info.motor_run_current,
                    info.motor_start_current,
                    info.motor_voltage,
                    info.trip_amps,
                    info.trip_voltage,
                    mrid
                ],
                function (err: any) {
                    if (err) return reject({ success: false, err, message: 'Update operatingMechanismInfo failed' })
                    return resolve({ success: true, data: info, message: 'Update operatingMechanismInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update operatingMechanismInfo transaction failed' })
        }
    })
}

export const deleteOperatingMechanismInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM operating_mechanism_info WHERE mrid = ?", [mrid], function (err: any) {
                if (err) return reject({ success: false, err, message: 'Delete operatingMechanismInfo failed' })

                AssetInfoFunc.deleteAssetInfoByIdTransaction(mrid, dbsql)
                    .then((res: any) => {
                        if (!res.success) return reject({ success: false, message: 'Delete AssetInfo failed', err: res.err })
                        return resolve({ success: true, data: mrid, message: 'Delete operatingMechanismInfo completed' })
                    })
                    .catch((err2: any) => reject({ success: false, err: err2, message: 'Delete AssetInfo transaction failed' }))
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete operatingMechanismInfo transaction failed' })
        }
    })
}
