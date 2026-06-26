import db from '../../datacontext/index'

export const insertOrganisationLocation = async (organisationLocation: { mrid: string; organisation_id: string; location_id: string }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO organisation_location(
                mrid, organisation_id, location_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                organisation_id = excluded.organisation_id,
                location_id = excluded.location_id`,
            [organisationLocation.mrid, organisationLocation.organisation_id, organisationLocation.location_id],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert organisationLocation failed' })
                return resolve({ success: true, data: organisationLocation, message: 'Insert organisationLocation completed' })
            }
        )
    })
}

export const insertOrganisationLocationTransaction = async (
    organisationLocation: { mrid: string; organisation_id: string; location_id: string },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO organisation_location(
                mrid, organisation_id, location_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(organisation_id, location_id) DO NOTHING`,
            [organisationLocation.mrid, organisationLocation.organisation_id, organisationLocation.location_id],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert organisationLocation failed' })
                return resolve({ success: true, data: organisationLocation, message: 'Insert organisationLocation completed' })
            }
        )
    })
}

export const getOrganisationLocationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM organisation_location WHERE mrid = ?', [mrid], (err: Error | null, row: unknown) => {
            if (err) return reject({ success: false, err, message: 'Get organisationLocation failed' })
            if (!row) return resolve({ success: false, data: null, message: 'OrganisationLocation not found' })
            return resolve({ success: true, data: row, message: 'Get organisationLocation completed' })
        })
    })
}

export const getOrganisationLocationByOrganisationIdAndLocationId = async (organisation_id: string, location_id: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM organisation_location WHERE organisation_id = ? AND location_id = ?',
            [organisation_id, location_id],
            (err: Error | null, row: unknown) => {
                if (err) return reject({ success: false, err, message: 'Get organisationLocation failed' })
                if (!row) return resolve({ success: false, data: null, message: 'OrganisationLocation not found' })
                return resolve({ success: true, data: row, message: 'Get organisationLocation completed' })
            }
        )
    })
}

export const updateOrganisationLocationById = async (mrid: string, organisationLocation: { organisation_id: string; location_id: string }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE organisation_location SET
                organisation_id = ?,
                location_id = ?
            WHERE mrid = ?`,
            [organisationLocation.organisation_id, organisationLocation.location_id, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update organisationLocation failed' })
                if (this.changes === 0) return resolve({ success: false, message: 'OrganisationLocation not found' })
                return resolve({ success: true, data: organisationLocation, message: 'Update organisationLocation completed' })
            }
        )
    })
}

export const deleteOrganisationLocationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM organisation_location WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete organisationLocation failed' })
            if (this.changes === 0) return resolve({ success: false, message: 'OrganisationLocation not found' })
            return resolve({ success: true, message: 'Delete organisationLocation completed' })
        })
    })
}
