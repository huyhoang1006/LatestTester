import db from '../../datacontext/index'
import * as testDataSetFunc from '../testDataSet/index'

export const getSurgeArresterTestDataSetById = async (mrid: string) => {
    try {
        const testDataSet: any = await testDataSetFunc.getTestDataSetById(mrid)
        if (!testDataSet.success) {
            return { success: false, data: null, message: 'TestDataSet not found' }
        }
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM surge_arrester_test_dataset WHERE mrid=?`,
                [mrid],
                (err: Error | null, row: any) => {
                    if (err) return reject({ success: false, err, message: 'Get surgeArresterTestDataSet by id failed' })
                    if (!row) return resolve({ success: false, data: null, message: 'SurgeArresterTestDataSet not found' })
                    return resolve({ success: true, data: { ...testDataSet.data, ...row }, message: 'Get surgeArresterTestDataSet by id completed' })
                }
            )
        })
    } catch (err) {
        return { success: false, err, message: 'Get surgeArresterTestDataSet by id failed' }
    }
}

export const insertSurgeArresterTestDataSetTransaction = async (
    surgeArresterTestDataSet: { mrid: string; assessment: string | null; condition_indicator: string | null },
    dbsql: typeof db
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const testResult: any = await testDataSetFunc.insertTestDataSetTransaction(surgeArresterTestDataSet, dbsql)
            if (!testResult.success) {
                return reject({ success: false, message: 'Insert testDataSet failed', err: testResult.err })
            }
            dbsql.run(
                `INSERT INTO surge_arrester_test_dataset(
                    mrid, assessment, condition_indicator
                ) VALUES (?, ?, ?)
                ON CONFLICT(mrid) DO UPDATE SET
                    assessment = excluded.assessment,
                    condition_indicator = excluded.condition_indicator
                `,
                [surgeArresterTestDataSet.mrid, surgeArresterTestDataSet.assessment, surgeArresterTestDataSet.condition_indicator],
                function (this: { lastID: number; changes: number }, err: Error | null) {
                    if (err) return reject({ success: false, err, message: 'Insert surgeArresterTestDataSet failed' })
                    return resolve({ success: true, data: surgeArresterTestDataSet, message: 'Insert surgeArresterTestDataSet completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Insert surgeArresterTestDataSet failed' })
        }
    })
}

export const updateSurgeArresterTestDataSetByIdTransaction = async (
    mrid: string,
    surgeArresterTestDataSet: { assessment: string | null; condition_indicator: string | null },
    dbsql: typeof db
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const testResult: any = await testDataSetFunc.updateTestDataSetByIdTransaction(mrid, surgeArresterTestDataSet, dbsql)
            if (!testResult.success) {
                return reject({ success: false, message: 'Update testDataSet failed', err: testResult.err })
            }
            dbsql.run(
                `UPDATE surge_arrester_test_dataset SET
                    assessment = ?,
                    condition_indicator = ?
                WHERE mrid = ?`,
                [surgeArresterTestDataSet.assessment, surgeArresterTestDataSet.condition_indicator, mrid],
                function (this: { lastID: number; changes: number }, err: Error | null) {
                    if (err) return reject({ success: false, err, message: 'Update surgeArresterTestDataSet failed' })
                    return resolve({ success: true, data: surgeArresterTestDataSet, message: 'Update surgeArresterTestDataSet completed' })
                }
            )
        } catch (err) {
            return reject({ success: false, err, message: 'Update surgeArresterTestDataSet failed' })
        }
    })
}

export const deleteSurgeArresterTestDataSetByIdTransaction = async (mrid: string, dbsql: typeof db) => {
    return new Promise(async (resolve, reject) => {
        try {
            dbsql.run('DELETE FROM surge_arrester_test_dataset WHERE mrid=?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) return reject({ success: false, err, message: 'Delete surgeArresterTestDataSet failed' })
                if (this.changes === 0) return resolve({ success: false, data: null, message: 'SurgeArresterTestDataSet not found' })
                testDataSetFunc.deleteTestDataSetByIdTransaction(mrid, dbsql)
                return resolve({ success: true, data: null, message: 'Delete surgeArresterTestDataSet completed' })
            })
        } catch (err) {
            return reject({ success: false, err, message: 'Delete surgeArresterTestDataSet failed' })
        }
    })
}
