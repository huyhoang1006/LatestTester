import dbsql from '@/function/datacontext/index'

const emptyToNull = (val: unknown) => (val === '' || val === undefined ? null : val)

export const insertCtCoreInfoTransaction = (info: any, _dbsql: any) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO ct_core_info (
                mrid, tap_count, common_tap, core_application, core_class, fs, alf,
                winding_resistance, ts, ek, e1, ie, ie1, kssc, val, tp, iai, k, ktd,
                duty, kx, current_transformer_info_id, ex, vb, vk, vk1, ik, ik1, ratio_error, core_index
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            ON CONFLICT(mrid) DO UPDATE SET
                tap_count = excluded.tap_count,
                common_tap = excluded.common_tap,
                core_application = excluded.core_application,
                core_class = excluded.core_class,
                fs = excluded.fs,
                alf = excluded.alf,
                winding_resistance = excluded.winding_resistance,
                ts = excluded.ts,
                ek = excluded.ek,
                e1 = excluded.e1,
                ie = excluded.ie,
                ie1 = excluded.ie1,
                kssc = excluded.kssc,
                val = excluded.val,
                tp = excluded.tp,
                iai = excluded.iai,
                k = excluded.k,
                ktd = excluded.ktd,
                duty = excluded.duty,
                kx = excluded.kx,
                current_transformer_info_id = excluded.current_transformer_info_id,
                ex = excluded.ex,
                vb = excluded.vb,
                vk = excluded.vk,
                vk1 = excluded.vk1,
                ik = excluded.ik,
                ik1 = excluded.ik1,
                ratio_error = excluded.ratio_error,
                core_index = excluded.core_index
        `

        const params = [
            info.mrid,
            info.tap_count,
            info.common_tap,
            info.core_application,
            info.core_class,
            info.fs,
            info.alf,
            emptyToNull(info.winding_resistance),
            info.ts,
            info.ek,
            info.e1,
            info.ie,
            info.ie1,
            info.kssc,
            info.val,
            info.tp,
            info.iai,
            info.k,
            info.ktd,
            info.duty,
            info.kx,
            info.current_transformer_info_id,
            info.ex,
            emptyToNull(info.vb),
            info.vk,
            info.vk1,
            info.ik,
            info.ik1,
            emptyToNull(info.ratio_error),
            info.core_index
        ]

        dbsql.run(sql, params, function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) {
                return reject({ success: false, err, message: 'Insert ctCoreInfo failed' })
            }
            return resolve({ success: true, data: info, message: 'Insert ctCoreInfo completed' })
        })
    })
}

export const getCtCoreInfoByCurrentTransformerInfoId = (current_transformer_info_id: string) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ct_core_info WHERE current_transformer_info_id = ?`
        const params = [current_transformer_info_id]
        dbsql.all(sql, params, function (err: Error | null, rows: unknown[]) {
            if (err) return reject({ success: false, err, message: 'Get ctCoreInfo failed' })
            return resolve({ success: true, data: rows, message: 'Get ctCoreInfo completed' })
        })
    })
}

export const deleteCtCoreInfoByCurrentTransformerInfoIdTransaction = (current_transformer_info_id: string, _dbsql: any) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ct_core_info WHERE current_transformer_info_id = ?`
        const params = [current_transformer_info_id]
        console.log('delete ct core info : ', current_transformer_info_id)
        dbsql.run(sql, params, function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete ctCoreInfo failed' })
            return resolve({ success: true, data: current_transformer_info_id, message: 'Delete ctCoreInfo completed' })
        })
    })
}
