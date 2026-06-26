import db from '../../datacontext/index'
import * as WireInfoFunc from '../wireInfo/index'

export const getCableInfoById = async (mrid: string) => {
    try {
        const wireInfoResult: any = await WireInfoFunc.getWireInfoById(mrid)
        if (!wireInfoResult.success) {
            return { success: false, data: null, message: 'WireInfo not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM cable_info WHERE mrid=?`,
                [mrid],
                (err: any, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get cableInfo by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'CableInfo not found' })
                    return resolve({ success: true, data: { ...wireInfoResult.data, ...row }, message: 'Get cableInfo by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get cableInfo by id failed' }
    }
}

export const insertCableInfoTransaction = async (info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wireInfoResult: any = await WireInfoFunc.insertWireInfoTransaction(info, dbsql)
            if (!wireInfoResult.success) {
                return reject({ success: false, message: 'Insert wireInfo failed', err: wireInfoResult.err })
            }
            dbsql.run(
                `INSERT INTO cable_info(
                    mrid, construction_kind, diameter_over_core, diameter_over_insulation, diameter_over_jacket,
                    diameter_over_screen, is_strand_fill, nominal_temperature, outer_jacket_kind,
                    sheath_as_neutral, shield_material
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    construction_kind = excluded.construction_kind,
                    diameter_over_core = excluded.diameter_over_core,
                    diameter_over_insulation = excluded.diameter_over_insulation,
                    diameter_over_jacket = excluded.diameter_over_jacket,
                    diameter_over_screen = excluded.diameter_over_screen,
                    is_strand_fill = excluded.is_strand_fill,
                    nominal_temperature = excluded.nominal_temperature,
                    outer_jacket_kind = excluded.outer_jacket_kind,
                    sheath_as_neutral = excluded.sheath_as_neutral,
                    shield_material = excluded.shield_material
                `,
                [
                    info.mrid,
                    info.construction_kind,
                    info.diameter_over_core,
                    info.diameter_over_insulation,
                    info.diameter_over_jacket,
                    info.diameter_over_screen,
                    info.is_strand_fill,
                    info.nominal_temperature,
                    info.outer_jacket_kind,
                    info.sheath_as_neutral,
                    info.shield_material
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Insert cableInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Insert cableInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert cableInfo transaction failed' })
        }
    })
}

export const updateCableInfoTransaction = async (mrid: string, info: any, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wireInfoResult: any = await WireInfoFunc.updateWireInfoTransaction(mrid, info, dbsql)
            if (!wireInfoResult.success) {
                return reject({ success: false, message: 'Update wireInfo failed', err: wireInfoResult.err })
            }
            dbsql.run(
                `UPDATE cable_info SET
                    construction_kind = ?,
                    diameter_over_core = ?,
                    diameter_over_insulation = ?,
                    diameter_over_jacket = ?,
                    diameter_over_screen = ?,
                    is_strand_fill = ?,
                    nominal_temperature = ?,
                    outer_jacket_kind = ?,
                    sheath_as_neutral = ?,
                    shield_material = ?
                WHERE mrid = ?`,
                [
                    info.construction_kind,
                    info.diameter_over_core,
                    info.diameter_over_insulation,
                    info.diameter_over_jacket,
                    info.diameter_over_screen,
                    info.is_strand_fill,
                    info.nominal_temperature,
                    info.outer_jacket_kind,
                    info.sheath_as_neutral,
                    info.shield_material,
                    mrid
                ],
                function (err: any) {
                    if (err) {
                        return reject({ success: false, err, message: 'Update cableInfo failed' })
                    }
                    return resolve({ success: true, data: info, message: 'Update cableInfo completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update cableInfo transaction failed' })
        }
    })
}

export const deleteCableInfoTransaction = async (mrid: string, dbsql: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run("DELETE FROM cable_info WHERE mrid=?", [mrid], async function (err: any) {
                if (err) {
                    return reject({ success: false, err, message: 'Delete cableInfo failed' })
                }
                try {
                    const wireInfoResult: any = await WireInfoFunc.deleteWireInfoTransaction(mrid, dbsql)
                    if (!wireInfoResult.success) {
                        return reject({ success: false, message: 'Delete wireInfo failed', err: wireInfoResult.err })
                    }
                    return resolve({ success: true, data: mrid, message: 'Delete cableInfo completed' })
                } catch (err2) {
                    return reject({ success: false, err: err2, message: 'Delete cableInfo transaction failed' })
                }
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete cableInfo transaction failed' })
        }
    })
}
