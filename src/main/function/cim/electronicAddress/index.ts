import db from '../../datacontext/index'

export const getElectronicAddressById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM electronic_address WHERE mrid=?", [mrid], (err: any, row: any) => {
            if (err) return reject({ success: false, err: err, message: 'Get electronic address by id failed' })
            if (!row) return resolve({ success: false, data: null, message: 'Electronic address not found' })
            return resolve({ success: true, data: row, message: 'Get electronic address by id completed' })
        })
    })
}

export const insertElectronicAddress = async (electronicAddress: any) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO electronic_address(mrid, email, lan, mac, password, radio, user_id,
             web, fax)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                email = excluded.email,
                lan = excluded.lan,
                mac = excluded.mac,
                password = excluded.password,
                radio = excluded.radio,
                user_id = excluded.user_id,
                web = excluded.web,
                fax = excluded.fax`,
            [
                electronicAddress.mrid,
                electronicAddress.email,
                electronicAddress.lan,
                electronicAddress.mac,
                electronicAddress.password,
                electronicAddress.radio,
                electronicAddress.user_id,
                electronicAddress.web,
                electronicAddress.fax
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Insert electronic address failed' })
                return resolve({ success: true, data: electronicAddress, message: 'Insert electronic address completed' })
            }
        )
    })
}

export const insertElectronicAddressTransaction = async (electronicAddress: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `INSERT INTO electronic_address(mrid, email, lan, mac, password, radio, user_id, web, fax)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(mrid) DO UPDATE SET
                email = excluded.email,
                lan = excluded.lan,
                mac = excluded.mac,
                password = excluded.password,
                radio = excluded.radio,
                user_id = excluded.user_id,
                web = excluded.web,
                fax = excluded.fax`,
            [
                electronicAddress.mrid,
                electronicAddress.email,
                electronicAddress.lan,
                electronicAddress.mac,
                electronicAddress.password,
                electronicAddress.radio,
                electronicAddress.user_id,
                electronicAddress.web,
                electronicAddress.fax
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Insert electronic address failed' })
                return resolve({ success: true, data: electronicAddress, message: 'Insert electronic address completed' })
            }
        )
    })
}

export const updateElectronicAddressById = async (mrid: string, electronicAddress: any) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE electronic_address
             SET email = ?, lan = ?, mac = ?, password = ?, radio = ?, user_id = ?, web = ?, fax = ?
             WHERE mrid = ?`,
            [
                electronicAddress.email,
                electronicAddress.lan,
                electronicAddress.mac,
                electronicAddress.password,
                electronicAddress.radio,
                electronicAddress.user_id,
                electronicAddress.web,
                electronicAddress.fax,
                mrid
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Update electronic address failed' })
                return resolve({ success: true, data: electronicAddress, message: 'Update electronic address completed' })
            }
        )
    })
}

export const updateElectronicAddressByIdTransaction = async (mrid: string, electronicAddress: any, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run(
            `UPDATE electronic_address
             SET email = ?, lan = ?, mac = ?, password = ?, radio = ?, user_id = ?, web = ?, fax = ?
             WHERE mrid = ?`,
            [
                electronicAddress.email,
                electronicAddress.lan,
                electronicAddress.mac,
                electronicAddress.password,
                electronicAddress.radio,
                electronicAddress.user_id,
                electronicAddress.web,
                electronicAddress.fax,
                mrid
            ],
            function (err: any) {
                if (err) return reject({ success: false, err, message: 'Update electronic address failed' })
                return resolve({ success: true, data: electronicAddress, message: 'Update electronic address completed' })
            }
        )
    })
}

export const deleteElectronicAddressById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM electronic_address WHERE mrid=?", [mrid], function (this: any, err: any) {
            if (err) return reject({ success: false, err, message: 'Delete electronic address failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Electronic address not found' })
            return resolve({ success: true, data: null, message: 'Delete electronic address completed' })
        })
    })
}

export const deleteElectronicAddressByIdTransaction = async (mrid: string, dbsql: any) => {
    return new Promise((resolve, reject) => {
        dbsql.run("DELETE FROM electronic_address WHERE mrid=?", [mrid], function (this: any, err: any) {
            if (err) return reject({ success: false, err, message: 'Delete electronic address failed' })
            if (this.changes === 0) return resolve({ success: false, data: null, message: 'Electronic address not found' })
            return resolve({ success: true, data: null, message: 'Delete electronic address completed' })
        })
    })
}
