import db from '../../datacontext/index'

export const getTemperatureById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM temperature WHERE mrid=?", [mrid], (err: any, row: any) => {
            if (err) return reject({ success: false, err: err, message: 'Get temperature by id failed' })
            if (!row) return resolve({ success: false, data: null, message: 'Temperature not found' })
            return resolve({ success: true, data: row, message: 'Get temperature by id completed' })
        })
    })
}

export const getTemperatureByIds = async (mrids: string[]) => {
    return new Promise((resolve, reject) => {
        if (!mrids || mrids.length === 0) {
            return resolve({ success: false, data: [], message: 'No mrids provided' })
        }

        const placeholders = mrids.map(() => '?').join(',')

        db.all(
            `SELECT * FROM temperature WHERE mrid IN (${placeholders})`,
            mrids,
            (err: any, rows: any) => {
                if (err) {
                    return reject({ success: false, err: err, message: 'Get temperature by ids failed' })
                }
                if (!rows || rows.length === 0) {
                    return resolve({ success: false, data: [], message: 'Temperature not found' })
                }
                return resolve({ success: true, data: rows, message: 'Get temperature by ids completed' })
            }
        )
    })
}

export const insertTemperature = async (temperature: any) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO temperature(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [
                temperature.mrid,
                temperature.multiplier,
                temperature.unit,
                temperature.value
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Insert temperature failed' })
                return resolve({ success: true, data: temperature, message: 'Insert temperature completed' })
            }
        )
    })
}

export const insertTemperatureTransaction = async (temperature: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO temperature(mrid, multiplier, unit, value)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                multiplier = excluded.multiplier,
                unit = excluded.unit,
                value = excluded.value`,
            [
                temperature.mrid,
                temperature.multiplier,
                temperature.unit,
                temperature.value
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Insert temperature failed' })
                return resolve({ success: true, data: temperature, message: 'Insert temperature completed' })
            }
        )
    })
}

export const updateTemperatureById = async (mrid: string, temperature: any) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE temperature
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [temperature.multiplier, temperature.unit, temperature.value, mrid],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Update temperature failed' })
                return resolve({ success: true, data: temperature, message: 'Update temperature completed' })
            }
        )
    })
}

export const updateTemperatureByIdTransaction = async (mrid: string, temperature: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE temperature
             SET multiplier = ?, unit = ?, value = ?
             WHERE mrid = ?`,
            [temperature.multiplier, temperature.unit, temperature.value, mrid],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Update temperature failed' })
                return resolve({ success: true, data: temperature, message: 'Update temperature completed' })
            }
        )
    })
}

export const deleteTemperatureById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM temperature WHERE mrid=?", [mrid], function (this: any, err: any) {
            if (err) return reject({ success: false, err, message: 'Delete temperature failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Temperature not found' })
            return resolve({ success: true, data: null, message: 'Delete temperature completed' })
        })
    })
}

export const deleteTemperatureByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run("DELETE FROM temperature WHERE mrid=?", [mrid], function (this: any, err: any) {
            if (err) return reject({ success: false, err, message: 'Delete temperature failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Temperature not found' })
            return resolve({ success: true, data: null, message: 'Delete temperature completed' })
        })
    })
}
