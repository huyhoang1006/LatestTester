import db from '../../datacontext/index'
import * as organisationFunc from '../organisation/index'

export const insertParentOrganisation = async (parentOrganization: any) => {
    console.log('[ParentOrg] Insert parent organisation:', parentOrganization?.mrid, parentOrganization?.name)
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION', (err: any) => {
                if (err) return reject({ success: false, err, message: 'Begin transaction failed' })
                organisationFunc.insertOrganisationTransaction(parentOrganization, db)
                    .then((parentResult: any) => {
                        if (!parentResult.success) {
                            db.run('ROLLBACK')
                            return reject({ success: false, err: parentResult.err, message: 'Insert parent organisation failed' })
                        }
                        db.run(
                            `INSERT INTO parent_organization(mrid) VALUES (?)
                             ON CONFLICT(mrid) DO NOTHING`,
                            [parentOrganization.mrid],
                            function (err: any) {
                                if (err) {
                                    db.run('ROLLBACK')
                                    return reject({ success: false, err, message: 'Insert organisation failed' })
                                }
                                db.run('COMMIT', (commitErr: any) => {
                                    if (commitErr) {
                                        return reject({ success: false, err: commitErr, message: 'Commit failed' })
                                    }
                                    return resolve({ success: true, data: parentOrganization, message: 'Insert organisation completed' })
                                })
                            }
                        )
                    })
                    .catch((err: any) => {
                        db.run('ROLLBACK')
                        return reject({ success: false, err, message: 'Insert organisation transaction failed' })
                    })
            })
        })
    })
}

export const insertParentOrganizationTransaction = async (parentOrganization: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        organisationFunc.insertOrganisationTransaction(parentOrganization, dbsql)
            .then((parentResult: any) => {
                if (!parentResult.success) {
                    return reject({ success: false, message: 'Insert parent organization failed', err: parentResult.err })
                }
                dbsql.run(
                    `INSERT INTO parent_organization (
                        mrid
                    ) VALUES (?)
                    ON CONFLICT(mrid) DO NOTHING`,
                    [
                        parentOrganization.mrid,
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Insert parent organization failed' })
                        }
                        return resolve({ success: true, data: parentOrganization, message: 'Insert parent organization completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Insert organisation transaction failed' })
            })
    })
}

export const getParentOrganizationById = async (mrid: string) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    o.*, 
                    i.*,
                    sd.address_general as address,
                    td.city,
                    td.state_or_province as state_province,
                    td.country,
                    td.ward_or_commune,
                    td.district_or_town,
                    tn.itu_phone as phone_no,
                    ea.email as email,
                    (SELECT x FROM geo_map WHERE organisation_id = o.mrid ORDER BY mrid ASC LIMIT 1) as geo_x,
                    (SELECT y FROM geo_map WHERE organisation_id = o.mrid ORDER BY mrid ASC LIMIT 1) as geo_y
                FROM organisation o
                JOIN identified_object i ON o.mrid = i.mrid
                LEFT JOIN street_address sa ON o.street_address = sa.mrid
                LEFT JOIN street_detail sd ON sa.street_detail = sd.mrid
                LEFT JOIN town_detail td ON sa.town_detail = td.mrid
                LEFT JOIN electronic_address ea ON o.electronic_address = ea.mrid
                LEFT JOIN telephone_number tn ON o.phone = tn.mrid
                WHERE CAST(o.mrid AS TEXT) = CAST(? AS TEXT)
            `
            
            const mridStr = String(mrid)
            
            db.get(query, [mridStr], (err: any, row: any) => {
                if (err) {
                    return reject({ success: false, err, message: 'Get parent organization failed' })
                }
                if (!row) {
                    return resolve({ success: false, data: null, message: 'Parent organization not found' })
                }
                
                return resolve({ success: true, data: row, message: 'Get parent organization completed' })
            })
        })
    } catch (err) {
        return { success: false, err, message: 'Get parent organization failed' }
    }
}

export const getParentOrganizationByParentId = async (parentId: string) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT 
                o.*, 
                i.*,
                sd.address_general as address,
                td.city,
                td.state_or_province as state_province,
                td.country,
                td.ward_or_commune,
                td.district_or_town,
                tn.itu_phone as phone_no,
                ea.email as email,
                (SELECT x FROM geo_map WHERE organisation_id = o.mrid ORDER BY mrid ASC LIMIT 1) as geo_x,
                (SELECT y FROM geo_map WHERE organisation_id = o.mrid ORDER BY mrid ASC LIMIT 1) as geo_y
             FROM organisation o
             JOIN identified_object i ON o.mrid = i.mrid
             LEFT JOIN street_address sa ON o.street_address = sa.mrid
             LEFT JOIN street_detail sd ON sa.street_detail = sd.mrid
             LEFT JOIN town_detail td ON sa.town_detail = td.mrid
             LEFT JOIN electronic_address ea ON o.electronic_address = ea.mrid
             LEFT JOIN telephone_number tn ON o.phone = tn.mrid
             WHERE CAST(o.parent_organisation AS TEXT) = CAST(? AS TEXT)`,
            [String(parentId)],
            (err: any, rows: any) => {
                if (err) {
                    return reject({ success: false, err, message: 'Get parent organizations by parentId failed' })
                }
                if (!rows || rows.length === 0) {
                    return resolve({ success: true, data: [], message: 'No parent organizations found' })
                }
               
                return resolve({ success: true, data: rows, message: 'Get parent organizations by parentId completed' })
            }
        )
    })
}

export const updateParentOrganizationById = async (mrid: string, parentOrganization: any) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION')
            organisationFunc.updateOrganisationByIdTransaction(mrid, parentOrganization, db)
                .then((parentResult: any) => {
                    if (!parentResult.success) {
                        db.run('ROLLBACK')
                        return reject({ success: false, message: 'Update parent organization failed', err: parentResult.err })
                    }
                    db.run(
                        `UPDATE parent_organization SET
                            mrid = ? 
                        WHERE mrid = ?`,
                        [
                            mrid
                        ],
                        function (err: any) {
                            if (err) {
                                db.run('ROLLBACK')
                                console.log(err)
                                return reject({ success: false, err, message: 'Update organisation failed' })
                            }
                            db.run('COMMIT')
                            return resolve({ success: true, data: parentOrganization, message: 'Update organisation completed' })
                        }
                    )
                })
                .catch((err: any) => {
                    db.run('ROLLBACK')
                    return reject({ success: false, err, message: 'Update organisation transaction failed' })
                })
        })
    })
}

export const updateParentOrganizationTransaction = async (mrid: string, parentOrganization: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        organisationFunc.updateOrganisationByIdTransaction(mrid, parentOrganization, dbsql)
            .then((identifiedResult: any) => {
                if (!identifiedResult.success) {
                    return reject({ success: false, message: 'Update identified object failed', err: identifiedResult.err })
                }
                dbsql.run(
                    `UPDATE parent_organization SET
                            mrid = ?
                        WHERE mrid = ?`,
                    [
                        mrid
                    ],
                    function (err: any) {
                        if (err) {
                            return reject({ success: false, err, message: 'Update organisation failed' })
                        }
                        return resolve({ success: true, data: parentOrganization, message: 'Update organisation completed' })
                    }
                )
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Update parent transaction failed' })
            })
    })
}

export const deleteParentOrganizationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        organisationFunc.deleteOrganisationByIdTransaction(mrid, db)
            .then((result: any) => {
                if (!result.success) {
                    return reject({ success: false, message: 'Delete identified object failed', err: result.err })
                }
                return resolve({ success: true, message: 'Delete organisation (and identified object) completed' })
            })
            .catch((err: any) => {
                return reject({ success: false, err, message: 'Delete organisation transaction failed' })
            })
    })
}

export const deleteParentOrganizationByIdTransaction = async (mrid: string, dbsql: any) => {
    return organisationFunc.deleteOrganisationByIdTransaction(mrid, dbsql)
}
