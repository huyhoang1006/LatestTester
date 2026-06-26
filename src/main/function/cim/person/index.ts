import db from '../../datacontext/index'
import * as identifiedObjectFunc from '../identifiedObject/index'

export const insertPerson = async (person: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc.insertIdentifiedObjectTransaction(person, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `INSERT INTO person(
                            mrid,
                            electronic_address,
                            first_name,
                            landline_phone,
                            last_name,
                            m_name,
                            mobile_phone,
                            prefix,
                            special_need,
                            suffix
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            electronic_address = excluded.electronic_address,
                            first_name = excluded.first_name,
                            landline_phone = excluded.landline_phone,
                            last_name = excluded.last_name,
                            m_name = excluded.m_name,
                            mobile_phone = excluded.mobile_phone,
                            prefix = excluded.prefix,
                            special_need = excluded.special_need,
                            suffix = excluded.suffix`,
                        [
                            person.mrid,
                            person.electronic_address,
                            person.first_name,
                            person.landline_phone,
                            person.last_name,
                            person.m_name,
                            person.mobile_phone,
                            person.prefix,
                            person.special_need,
                            person.suffix,
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Insert person failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: person, message: 'Insert person completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Insert person transaction failed' })
                })
        })
    })
}

export const insertPersonTransaction = async (person: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.insertIdentifiedObjectTransaction(person, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Insert identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `INSERT INTO person(
                        mrid,
                        electronic_address,
                        first_name,
                        landline_phone,
                        last_name,
                        m_name,
                        mobile_phone,
                        prefix,
                        special_need,
                        suffix
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        electronic_address = excluded.electronic_address,
                        first_name = excluded.first_name,
                        landline_phone = excluded.landline_phone,
                        last_name = excluded.last_name,
                        m_name = excluded.m_name,
                        mobile_phone = excluded.mobile_phone,
                        prefix = excluded.prefix,
                        special_need = excluded.special_need,
                        suffix = excluded.suffix`,
                    [
                        person.mrid,
                        person.electronic_address,
                        person.first_name,
                        person.landline_phone,
                        person.last_name,
                        person.m_name,
                        person.mobile_phone,
                        person.prefix,
                        person.special_need,
                        person.suffix,
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert person failed' })
                        }
                        return resolve({ success: true, data: person, message: 'Insert person completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Insert person transaction failed' })
            })
    })
}

export const getPersonById = async (mrid: string) => {
    try {
        const identifiedResult: any = await identifiedObjectFunc.getIdentifiedObjectById(mrid)
        if (!identifiedResult.success) {
            return { success: false, data: null, message: 'Identified object not found' }
        }

        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM person WHERE mrid = ?", [mrid], (err: any, row: any) => {
                if (err) return reject({ success: false, err, message: 'Get person failed' })
                if (!row) return resolve({ success: false, data: null, message: 'Person not found' })
                const data = { ...identifiedResult.data, ...row }
                return resolve({ success: true, data: data, message: 'Get person completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get person failed' }
    }
}

export const getPersonByOrganisationId = async (organisationId: string) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.*, io.name
            FROM person p
            JOIN identified_object io ON p.mrid = io.mrid
            WHERE p.mrid IN (
                SELECT DISTINCT person_id
                FROM organisation_person
                WHERE organisation_id = ?
            )
        `;
        db.all(query, [organisationId], (err: any, rows: any) => {
            if (err) {
                return reject({
                    success: false,
                    err,
                    message: 'Get persons by organisation id failed'
                });
            }

            return resolve({
                success: true,
                data: rows,
                message: rows.length ? 'Get persons by organisation id completed' : 'No persons found for this organisation'
            });
        });
    });
};



export const deletePersonById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete identified object failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete person (and identified object) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete person transaction failed' })
            })
    })
}

export const deletePersonByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.deleteIdentifiedObjectByIdTransaction(mrid, dbsql)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete identified object failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete person (and identified object) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete person transaction failed' })
            })
    })
}

export const updatePersonById = async (mrid: string, person: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, person, db)
                .then((identifiedResult: any) => {
                    if (!identifiedResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                    }
                    db.run(
                        `UPDATE person SET
                            electronic_address = ?,
                            first_name = ?,
                            landline_phone = ?,
                            last_name = ?,
                            m_name = ?,
                            mobile_phone = ?,
                            prefix = ?,
                            special_need = ?,
                            suffix = ?,
                        WHERE mrid = ?`,
                        [
                            person.electronic_address,
                            person.first_name,
                            person.landline_phone,
                            person.last_name,
                            person.m_name,
                            person.mobile_phone,
                            person.prefix,
                            person.special_need,
                            person.suffix,
                            mrid
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                return reject({ success: false, err, message: 'Update person failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: person, message: 'Update person completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update person transaction failed' })
                })
        })
    })
}

export const updatePersonByIdTransaction = async (mrid: string, person: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        identifiedObjectFunc.updateIdentifiedObjectByIdTransaction(mrid, person, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `UPDATE person SET
                        electronic_address = ?,
                        first_name = ?,
                        landline_phone = ?,
                        last_name = ?,
                        m_name = ?,
                        mobile_phone = ?,
                        prefix = ?,
                        special_need = ?,
                        suffix = ?,
                    WHERE mrid = ?`,
                    [
                        person.electronic_address,
                        person.first_name,
                        person.landline_phone,
                        person.last_name,
                        person.m_name,
                        person.mobile_phone,
                        person.prefix,
                        person.special_need,
                        person.suffix,
                        mrid
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update person failed' })
                        }
                        return resolve({ success: true, data: person, message: 'Update person completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Update person transaction failed' })
            })
    })
}
