import db from '../../datacontext/index'
import * as equipmentContainerFunc from '../equipmentContainer/index'

export const insertSubstation = async (substation: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            equipmentContainerFunc.insertEquipmentContainerTransaction(substation, db)
                .then((result: any) => {
                    if (!result.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Insert EquipmentContainer failed', err: result.err })
                    }
                    db.run(
                        `INSERT INTO substation(mrid, generation, industry)
                         VALUES (?, ?, ?)
                         ON CONFLICT(mrid) DO UPDATE SET
                            generation = excluded.generation,
                            industry = excluded.industry`,
                        [substation.mrid, substation.generation, substation.industry],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Insert Substation failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: substation, message: 'Insert Substation completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Insert Substation transaction failed' })
                })
        })
    })
}

export const insertSubstationTransaction = async (substation: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        equipmentContainerFunc.insertEquipmentContainerTransaction(substation, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Insert EquipmentContainer failed', err: result.err })
                }
                dbsql.run(
                    `INSERT INTO substation(mrid, generation, industry)
                     VALUES (?, ?, ?)
                     ON CONFLICT(mrid) DO UPDATE SET
                        generation = excluded.generation,
                        industry = excluded.industry`,
                    [substation.mrid, substation.generation, substation.industry],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert Substation failed' })
                        }
                        return resolve({ success: true, data: substation, message: 'Insert Substation completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Insert Substation transaction failed' })
            })
    })
}

export const getSubstationsInOrganisationForUser = async (organisationId: string, userId: string) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT
                    s.*, 
                    io.name AS name,
                    io.alias_name AS alias_name
                FROM substation s
                JOIN power_system_resource psr ON s.mrid = psr.mrid
                JOIN organisation_psr opsr ON psr.mrid = opsr.psr_id
                JOIN user_identified_object uio ON s.mrid = uio.identified_object_id
                JOIN identified_object io ON s.mrid = io.mrid
                WHERE CAST(opsr.organisation_id AS TEXT) = CAST(? AS TEXT)
                AND CAST(uio.user_id AS TEXT) = CAST(? AS TEXT)
            `;

            db.all(query, [organisationId, userId], (err: any, rows: any) => {
                if (err) {
                    return reject({ success: false, data: null, message: 'Query failed', err: err });
                }
                if (!rows || rows.length === 0) {
                    return resolve({ success: false, data: [], message: 'No substations found for this user in organisation' });
                }

                return resolve({
                    success: true,
                    data: rows,
                    message: 'Substations in organisation for user retrieved'
                });
            });
        });
    } catch (err) {
        return { success: false, data: null, message: 'Unexpected error', err };
    }
};


export const getSubstationById = async (mrid: string) => {
    try {
        const ecResult: any = await equipmentContainerFunc.getEquipmentContainerById(mrid)
        if (!ecResult.success) {
            return { success: false, data: null, message: 'EquipmentContainer not found' }
        }
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM substation WHERE mrid = ?", [mrid], (err: any, row: any) => {
                if (err) return reject({ success: false, data: null, message: 'Get Substation failed', err })
                if (!row) return resolve({ success: false, data: null, message: 'Substation not found' })
                const data = { ...ecResult.data, ...row }
                return resolve({ success: true, data: data, message: 'Get Substation completed' })
            })
        })
    } catch (err) {
        return { success: false, data: null, message: 'Get Substation failed', err }
    }
}

export const updateSubstationById = async (mrid: string, substation: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            equipmentContainerFunc.updateEquipmentContainerByIdTransaction(mrid, substation, db)
                .then((result: any) => {
                    if (!result.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update EquipmentContainer failed', err: result.err })
                    }
                    db.run(
                        `UPDATE substation SET
                            generation = ?,
                            industry = ?
                         WHERE mrid = ?`,
                        [substation.generation, substation.industry, mrid],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Update Substation failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: substation, message: 'Update Substation completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update Substation transaction failed' })
                })
        })
    })
}

export const updateSubstationByIdTransaction = async (mrid: string, substation: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        equipmentContainerFunc.updateEquipmentContainerByIdTransaction(mrid, substation, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Update EquipmentContainer failed', err: result.err })
                }
                dbsql.run(
                    `UPDATE substation SET
                        generation = ?,
                        industry = ?
                     WHERE mrid = ?`,
                    [substation.generation, substation.industry, mrid],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update Substation failed' })
                        }
                        return resolve({ success: true, data: substation, message: 'Update Substation completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Update Substation transaction failed' })
            })
    })
}

export const deleteSubstationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        equipmentContainerFunc.deleteEquipmentContainerByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete EquipmentContainer failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete Substation (and EquipmentContainer) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete Substation transaction failed' })
            })
    })
}

export const deleteSubstationByIdTransaction = async (mrid: string, dbsql: any) => {
    return equipmentContainerFunc.deleteEquipmentContainerByIdTransaction(mrid, dbsql)
}
