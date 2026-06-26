import db from '../../datacontext/index'

export const getOperatingMechanismComponentById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM operating_mechanism_component WHERE mrid = ?`,
            [mrid],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get operatingMechanismComponent by id failed' })
                if (!row) return resolve({ success: false, data: null, message: 'OperatingMechanismComponent not found' })
                return resolve({ success: true, data: row, message: 'Get operatingMechanismComponent by id completed' })
            }
        )
    })
}

export const getOperatingMechanismComponentByOperatingMechanismId = async (operatingMechanismId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM operating_mechanism_component WHERE operating_mechanism_id = ?`,
            [operatingMechanismId],
            (err: Error | null, rows: unknown[]) => {
                if (err) return reject({ success: false, err, message: 'Get operatingMechanismComponent by operating_mechanism_id failed' })
                return resolve({ success: true, data: rows, message: 'Get operatingMechanismComponent by operating_mechanism_id completed' })
            }
        )
    })
}

export const insertOperatingMechanismComponentTransaction = async (
    info: {
        mrid: string
        operating_mechanism_id: string
        component: string | null
        rated_current: string | null
        rated_voltage: string | null
        rated_frequency: string | null
        power_type: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO operating_mechanism_component(
                mrid, operating_mechanism_id, component, rated_current, rated_voltage, rated_frequency, power_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                operating_mechanism_id = excluded.operating_mechanism_id,
                component = excluded.component,
                rated_current = excluded.rated_current,
                rated_voltage = excluded.rated_voltage,
                rated_frequency = excluded.rated_frequency,
                power_type = excluded.power_type
            `,
            [info.mrid, info.operating_mechanism_id, info.component, info.rated_current, info.rated_voltage, info.rated_frequency, info.power_type],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert operatingMechanismComponent failed' })
                return resolve({ success: true, data: info, message: 'Insert operatingMechanismComponent completed' })
            }
        )
    })
}

export const updateOperatingMechanismComponentTransaction = async (
    mrid: string,
    info: {
        operating_mechanism_id: string
        component: string | null
        rated_current: string | null
        rated_voltage: string | null
        rated_frequency: string | null
        power_type: string | null
    },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE operating_mechanism_component SET
                operating_mechanism_id = ?,
                component = ?,
                rated_current = ?,
                rated_voltage = ?,
                rated_frequency = ?,
                power_type = ?
            WHERE mrid = ?`,
            [info.operating_mechanism_id, info.component, info.rated_current, info.rated_voltage, info.rated_frequency, info.power_type, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update operatingMechanismComponent failed' })
                return resolve({ success: true, data: info, message: 'Update operatingMechanismComponent completed' })
            }
        )
    })
}

export const deleteOperatingMechanismComponentTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise((resolve, reject) => {
        dbsql.run('DELETE FROM operating_mechanism_component WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete operatingMechanismComponent failed' })
            return resolve({ success: true, data: mrid, message: 'Delete operatingMechanismComponent completed' })
        })
    })
}
