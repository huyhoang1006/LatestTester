import db from '../../datacontext/index'

export const getTerminalCableInfoById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM terminal_cable_info WHERE mrid=?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get terminalCableInfo by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'TerminalCableInfo not found' })
                return resolve({ success: true, data: row, message: 'Get terminalCableInfo by id completed' })
            }
        )
    })
}

export const getTerminalCableInfoByCableInfoId = async (cableInfoId: string) => {
    try {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM terminal_cable_info WHERE cable_info_id=?', [cableInfoId], (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get terminal cable info by cable info id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'Terminal cable info not found' })
                return resolve({ success: true, data: row, message: 'Get terminal cable info by cable info id completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get terminal cable info by cable info id failed' }
    }
}

export const insertTerminalCableInfoTransaction = async (
    info: {
        mrid: string
        rated_u: string | null
        bil: string | null
        bsl: string | null
        type: string | null
        connector_type: string | null
        service_condition: string | null
        cable_info_id: string | null
        class: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO terminal_cable_info(
                mrid, rated_u, bil, bsl, type, connector_type, service_condition, cable_info_id, class
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                rated_u = excluded.rated_u,
                bil = excluded.bil,
                bsl = excluded.bsl,
                type = excluded.type,
                connector_type = excluded.connector_type,
                service_condition = excluded.service_condition,
                cable_info_id = excluded.cable_info_id,
                class = excluded.class
            `,
            [
                info.mrid,
                info.rated_u,
                info.bil,
                info.bsl,
                info.type,
                info.connector_type,
                info.service_condition,
                info.cable_info_id,
                info.class
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert terminalCableInfo failed' })
                return resolve({ success: true, data: info, message: 'Insert terminalCableInfo completed' })
            }
        )
    })
}

export const updateTerminalCableInfoTransaction = async (
    mrid: string,
    info: {
        rated_u: string | null
        bil: string | null
        bsl: string | null
        type: string | null
        connector_type: string | null
        service_condition: string | null
        cable_info_id: string | null
        class: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE terminal_cable_info SET
                rated_u = ?,
                bil = ?,
                bsl = ?,
                type = ?,
                connector_type = ?,
                service_condition = ?,
                cable_info_id = ?,
                class = ?
            WHERE mrid = ?`,
            [
                info.rated_u,
                info.bil,
                info.bsl,
                info.type,
                info.connector_type,
                info.service_condition,
                info.cable_info_id,
                info.class,
                mrid
            ],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update terminalCableInfo failed' })
                return resolve({ success: true, data: info, message: 'Update terminalCableInfo completed' })
            }
        )
    })
}

export const deleteTerminalCableInfoTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM terminal_cable_info WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete terminalCableInfo failed' })
            return resolve({ success: true, data: mrid, message: 'Delete terminalCableInfo completed' })
        })
    })
}
