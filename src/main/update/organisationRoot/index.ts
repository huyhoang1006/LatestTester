import db from '../../function/datacontext/index'
import * as parentOrganisationFunc from '../../function/cim/parentOrganization/index'

const ROOT_MRID = '00000000-0000-0000-0000-000000000000'
const ROOT_NAME = 'Root'

export const createOrganisationRoot = async (
  dbsql: any = db
): Promise<{ success: boolean; data?: any; message?: string; err?: any }> => {
  const parentOrganisation = {
    mrid: ROOT_MRID,
    name: ROOT_NAME
  }

  const runAsync = (sql: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      dbsql.run(sql, function (this: unknown, err: Error | null) {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  try {
    await runAsync('BEGIN TRANSACTION')
    const result: any = await parentOrganisationFunc.insertParentOrganizationTransaction(
      parentOrganisation,
      dbsql
    )
    if (!result.success) {
      await runAsync('ROLLBACK')
      throw new Error(result.err && result.err.message ? result.err.message : 'Insert failed')
    }
    await runAsync('COMMIT')
    return { success: true, data: result.data, message: 'Create organisation root completed' }
  } catch (err: any) {
    await runAsync('ROLLBACK')
    console.error('[OrgRoot] ❌ Create organisation root transaction failed:', err?.message || err)
    return { success: false, err, message: 'Create organisation root transaction failed' }
  }
}
