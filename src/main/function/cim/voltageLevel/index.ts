import db from '../../datacontext/index'
import * as equipmentContainerFunc from '../equipmentContainer/index'


export const insertVoltageLevel = async (voltageLevel: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            equipmentContainerFunc.insertEquipmentContainerTransaction(voltageLevel, db)
                .then((result: any) => {
                    if (!result.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Insert EquipmentContainer failed', err: result.err })
                    }
                    db.run(
                        `INSERT INTO voltage_level(mrid, high_voltage_limit, low_voltage_limit, base_voltage, substation)
                         VALUES (?, ?, ?, ?, ?)
                         ON CONFLICT(mrid) DO UPDATE SET
                            high_voltage_limit = excluded.high_voltage_limit,
                            low_voltage_limit = excluded.low_voltage_limit,
                            base_voltage = excluded.base_voltage,
                            substation = excluded.substation`,
                        [voltageLevel.mrid, voltageLevel.high_voltage_limit, voltageLevel.low_voltage_limit, voltageLevel.base_voltage, voltageLevel.substation],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Insert VoltageLevel failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: voltageLevel, message: 'Insert VoltageLevel completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Insert VoltageLevel transaction failed' })
                })
        })
    })
}

export const insertVoltageLevelTransaction = async (voltageLevel: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        equipmentContainerFunc.insertEquipmentContainerTransaction(voltageLevel, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Insert EquipmentContainer failed', err: result.err })
                }
                dbsql.run(
                    `INSERT INTO voltage_level(mrid, high_voltage_limit, low_voltage_limit, base_voltage, substation)
                     VALUES (?, ?, ?, ?, ?)
                     ON CONFLICT(mrid) DO UPDATE SET
                        high_voltage_limit = excluded.high_voltage_limit,
                        low_voltage_limit = excluded.low_voltage_limit,
                        base_voltage = excluded.base_voltage,
                        substation = excluded.substation`,
                    [voltageLevel.mrid, voltageLevel.high_voltage_limit, voltageLevel.low_voltage_limit, voltageLevel.base_voltage, voltageLevel.substation],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert VoltageLevel failed' })
                        }
                        return resolve({ success: true, data: voltageLevel, message: 'Insert VoltageLevel completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Insert VoltageLevel transaction failed' })
            })
    })
}


export const getVoltageLevelById = async (mrid: string) => {
    try {
        const ecResult: any = await equipmentContainerFunc.getEquipmentContainerById(mrid)
        if (!ecResult.success) {
            return { success: false, data: null, message: 'EquipmentContainer not found' }
        }
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM voltage_level WHERE mrid = ?", [mrid], (err: any, row: any) => {
                if (err) return reject({ success: false, data: null, message: 'Get VoltageLevel failed', err })
                if (!row) return resolve({ success: false, data: null, message: 'VoltageLevel not found' })
                const data = { ...ecResult.data, ...row }
                return resolve({ success: true, data: data, message: 'Get VoltageLevel completed' })
            })
        })
    } catch (err) {
        return { success: false, data: null, message: 'Get VoltageLevel failed', err }
    }
}

export const getVoltageLevelsBySubstationId = (substationId: string) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                vl.*, 
                io.*
            FROM voltage_level vl
            JOIN identified_object io ON vl.mrid = io.mrid
            WHERE vl.substation = ?
        `;

        db.all(sql, [substationId], (err: any, rows: any) => {
            if (err) {
                console.error('Get VoltageLevels by substation failed:', err);
                return reject({
                    success: false,
                    data: null,
                    message: 'Get VoltageLevels by substation failed',
                    err
                });
            }

            if (!rows || rows.length === 0) {
                return resolve({
                    success: false,
                    data: [],
                    message: 'No voltage levels found for this substation'
                });
            }

            return resolve({
                success: true,
                data: rows,
                message: 'Get VoltageLevels by substation completed'
            });
        });
    });
};


export const updateVoltageLevelById = async (mrid: string, voltageLevel: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            equipmentContainerFunc.updateEquipmentContainerByIdTransaction(mrid, voltageLevel, db)
                .then((result: any) => {
                    if (!result.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update EquipmentContainer failed', err: result.err })
                    }
                    db.run(
                        `UPDATE voltage_level SET
                            high_voltage_limit = ?,
                            low_voltage_limit = ?,
                            base_voltage = ?,
                            substation = ?
                     WHERE mrid = ?`,
                        [voltageLevel.high_voltage_limit, voltageLevel.low_voltage_limit, voltageLevel.base_voltage, voltageLevel.substation, mrid],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Update VoltageLevel failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: voltageLevel, message: 'Update VoltageLevel completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update VoltageLevel transaction failed' })
                })
        })
    })
}

export const updateVoltageLevelByIdTransaction = async (mrid: string, voltageLevel: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        equipmentContainerFunc.updateEquipmentContainerByIdTransaction(mrid, voltageLevel, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Update EquipmentContainer failed', err: result.err })
                }
                dbsql.run(
                    `UPDATE voltage_level SET
                        high_voltage_limit = ?,
                        low_voltage_limit = ?,
                        base_voltage = ?,
                        substation = ?
                     WHERE mrid = ?`,
                    [voltageLevel.high_voltage_limit, voltageLevel.low_voltage_limit, voltageLevel.base_voltage, voltageLevel.substation, mrid],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update VoltageLevel failed' })
                        }
                        return resolve({ success: true, data: voltageLevel, message: 'Update VoltageLevel completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Update VoltageLevel transaction failed' })
            })
    })
}

export const deleteVoltageLevelById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        equipmentContainerFunc.deleteEquipmentContainerByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete EquipmentContainer failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete Substation (and EquipmentContainer) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete VoltageLevel transaction failed' })
            })
    })
}

export const deleteVoltageLevelByIdTransaction = async (mrid: string, dbsql: any) => {
    return equipmentContainerFunc.deleteEquipmentContainerByIdTransaction(mrid, dbsql)
}
