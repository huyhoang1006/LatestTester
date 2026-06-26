import db from '../../datacontext/index'

export const insertPersonSubstation = async (personSubstation: { mrid: string; person_id: string; substation_id: string }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO person_substation(
                mrid, person_id, substation_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                person_id = excluded.person_id,
                substation_id = excluded.substation_id`,
            [personSubstation.mrid, personSubstation.person_id, personSubstation.substation_id],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert personSubstation failed' })
                return resolve({ success: true, data: personSubstation, message: 'Insert personSubstation completed' })
            }
        )
    })
}

export const insertPersonSubstationTransaction = async (
    personSubstation: { mrid: string; person_id: string; substation_id: string },
    dbsql: typeof db
) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO person_substation(
                mrid, person_id, substation_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                person_id = excluded.person_id,
                substation_id = excluded.substation_id`,
            [personSubstation.mrid, personSubstation.person_id, personSubstation.substation_id],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Insert personSubstation failed' })
                return resolve({ success: true, data: personSubstation, message: 'Insert personSubstation completed' })
            }
        )
    })
}

export const getPersonSubstationByPersonId = async (personId: string) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM person_substation WHERE person_id = ?', [personId], (err: Error | null, rows: unknown[]) => {
            if (err) return reject({ success: false, err, message: 'Get personSubstation by personId failed' })
            if (rows.length === 0) return resolve({ success: false, data: null, message: 'PersonSubstation not found' })
            return resolve({ success: true, data: rows, message: 'Get personSubstation by personId completed' })
        })
    })
}

export const getPersonSubstationBySubstationId = async (substationId: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM person_substation WHERE substation_id = ?', [substationId], (err: Error | null, row: unknown) => {
            if (err) return reject({ success: false, err, message: 'Get personSubstation by substationId failed' })
            if (!row) return resolve({ success: false, data: null, message: 'PersonSubstation not found' })
            return resolve({ success: true, data: row, message: 'Get personSubstation by substationId completed' })
        })
    })
}

export const getPersonSubstationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM person_substation WHERE mrid = ?', [mrid], (err: Error | null, row: unknown) => {
            if (err) return reject({ success: false, err, message: 'Get personSubstation failed' })
            if (!row) return resolve({ success: false, data: null, message: 'PersonSubstation not found' })
            return resolve({ success: true, data: row, message: 'Get personSubstation completed' })
        })
    })
}

export const updatePersonSubstationById = async (mrid: string, personSubstation: { person_id: string; substation_id: string }) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE person_substation SET
                person_id = ?,
                substation_id = ?
            WHERE mrid = ?`,
            [personSubstation.person_id, personSubstation.substation_id, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Update personSubstation failed' })
                if (this.changes === 0) return resolve({ success: false, message: 'PersonSubstation not found' })
                return resolve({ success: true, data: personSubstation, message: 'Update personSubstation completed' })
            }
        )
    })
}

export const deletePersonSubstationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM person_substation WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) return reject({ success: false, err, message: 'Delete personSubstation failed' })
            if (this.changes === 0) return resolve({ success: false, message: 'PersonSubstation not found' })
            return resolve({ success: true, message: 'Delete personSubstation completed' })
        })
    })
}
