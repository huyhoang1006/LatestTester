import db from '../../datacontext/index'

export const insertOrganisationPerson: any = async (organisationPerson: any) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO organisation_person(
                mrid,
                organisation_id,
                person_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                organisation_id = excluded.organisation_id,
                person_id = excluded.person_id`,
            [
                organisationPerson.mrid,
                organisationPerson.organisation_id,
                organisationPerson.person_id
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Insert organisationPerson failed' })
                return resolve({ success: true, data: organisationPerson, message: 'Insert organisationPerson completed' })
            }
        )
    })
}

export const insertOrganisationPersonTransaction: any = async (organisationPerson: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO organisation_person(
                mrid,
                organisation_id,
                person_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(organisation_id, person_id) DO NOTHING`,
            [
                organisationPerson.mrid,
                organisationPerson.organisation_id,
                organisationPerson.person_id
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Insert organisationPerson failed' })
                return resolve({ success: true, data: organisationPerson, message: 'Insert organisationPerson completed' })
            }
        )
    })
}

export const getOrganisationPersonById: any = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM organisation_person WHERE mrid = ?", [mrid], (err: any, row: any) => {
            if (err) return reject({ success: false, err, message: 'Get organisationPerson failed' })
            if (!row) return resolve({ success: false, data: null, message: 'OrganisationPerson not found' })
            return resolve({ success: true, data: row, message: 'Get organisationPerson completed' })
        })
    })
}

export const getOrganisationPersonByOrganisationId: any = async (organisation_id: string) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM organisation_person WHERE organisation_id = ?", [organisation_id], (err: any, rows: any) => {
            if (err) return reject({ success: false, err, message: 'Get organisationPerson failed' })
            if (!rows || rows.length === 0) return resolve({ success: false, data: null, message: 'OrganisationPerson not found' })
            return resolve({ success: true, data: rows, message: 'Get organisationPerson completed' })
        })
    })
}

export const getOrganisationPersonByOrganisationIdAndPersonId: any = async (organisation_id: string, person_id: string) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM organisation_person WHERE organisation_id = ? AND person_id = ?", [organisation_id, person_id], (err: any, row: any) => {
            if (err) return reject({ success: false, err, message: 'Get organisationPerson failed' })
            if (!row) return resolve({ success: false, data: null, message: 'OrganisationPerson not found' })
            return resolve({ success: true, data: row, message: 'Get organisationPerson completed' })
        })
    })
}

export const getOrganisationPersonByPersonId: any = async (person_id: string) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM organisation_person WHERE person_id = ?", [person_id], (err: any, rows: any) => {
            if (err) return reject({ success: false, err, message: 'Get organisationPerson failed' })
            if (!rows || rows.length === 0) return resolve({ success: false, data: null, message: 'OrganisationPerson not found' })
            return resolve({ success: true, data: rows, message: 'Get organisationPerson completed' })
        })
    })
}

export const updateOrganisationPersonById: any = async (mrid: string, organisationPerson: any) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE organisation_person SET
                organisation_id = ?,
                person_id = ?
            WHERE mrid = ?`,
            [
                organisationPerson.organisation_id,
                organisationPerson.person_id,
                mrid
            ],
            function (this: any, err: any) {
                if (err) return reject({ success: false, err, message: 'Update organisationPerson failed' })
                if (this.changes === 0) return resolve({ success: false, message: 'OrganisationPerson not found' })
                return resolve({ success: true, data: organisationPerson, message: 'Update organisationPerson completed' })
            }
        )
    })
}

export const deleteOrganisationLocationById: any = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM organisation_location WHERE mrid = ?", [mrid], function (this: any, err: any) {
            if (err) return reject({ success: false, err, message: 'Delete organisationLocation failed' })
            if (this.changes === 0) return resolve({ success: false, message: 'OrganisationLocation not found' })
            return resolve({ success: true, message: 'Delete organisationLocation completed' })
        })
    })
}