import db from '../../datacontext/index'
import * as activityRecordFunc from '../activityRecord/index'

export const insertConfigurationEvent = async (event: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      activityRecordFunc
        .insertActivityRecordTransaction(event, db)
        .then((activityResult: any) => {
          if (!activityResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Insert activity record failed',
              err: activityResult.err
            })
          }
          db.run(
            `INSERT INTO configuration_event(
                            mrid, effective_date_time, remark, power_system_resource, changed_location, changed_asset,
                            changed_organisation_role, changed_organisation, changed_person_role, changed_person, changed_attachment, modified_by, user_name
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(mrid) DO UPDATE SET
                            effective_date_time = excluded.effective_date_time,
                            remark = excluded.remark,
                            power_system_resource = excluded.power_system_resource,
                            changed_location = excluded.changed_location,
                            changed_asset = excluded.changed_asset,
                            changed_organisation_role = excluded.changed_organisation_role,
                            changed_organisation = excluded.changed_organisation,
                            changed_person_role = excluded.changed_person_role,
                            changed_person = excluded.changed_person,
                            changed_attachment = excluded.changed_attachment,
                            modified_by = excluded.modified_by,
                            user_name = excluded.user_name`,
            [
              event.mrid,
              event.effective_date_time,
              event.remark,
              event.power_system_resource,
              event.changed_location,
              event.changed_asset,
              event.changed_organisation_role,
              event.changed_organisation,
              event.changed_person_role,
              event.changed_person,
              event.changed_attachment,
              event.modified_by,
              event.user_name
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Insert configuration event failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: event,
                message: 'Insert configuration event completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Insert configuration event transaction failed'
          })
        })
    })
  })
}

export const insertConfigurationEventTransaction = async (event: any, dbsql: any) => {
  return new Promise((resolve, reject) => {
    activityRecordFunc
      .insertActivityRecordTransaction(event, dbsql)
      .then((activityResult: any) => {
        if (!activityResult.success) {
          return reject({
            success: false,
            message: 'Insert activity record failed',
            err: activityResult.err
          })
        }
        dbsql.run(
          `INSERT INTO configuration_event(
                        mrid, effective_date_time, remark, power_system_resource, changed_location, changed_asset,
                        changed_organisation_role, changed_organisation, changed_person_role, changed_person, changed_attachment, modified_by, user_name
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(mrid) DO UPDATE SET
                        effective_date_time = excluded.effective_date_time,
                        remark = excluded.remark,
                        power_system_resource = excluded.power_system_resource,
                        changed_location = excluded.changed_location,
                        changed_asset = excluded.changed_asset,
                        changed_organisation_role = excluded.changed_organisation_role,
                        changed_organisation = excluded.changed_organisation,
                        changed_person_role = excluded.changed_person_role,
                        changed_person = excluded.changed_person,
                        changed_attachment = excluded.changed_attachment,
                        modified_by = excluded.modified_by,
                        user_name = excluded.user_name`,
          [
            event.mrid,
            event.effective_date_time,
            event.remark,
            event.power_system_resource,
            event.changed_location,
            event.changed_asset,
            event.changed_organisation_role,
            event.changed_organisation,
            event.changed_person_role,
            event.changed_person,
            event.changed_attachment,
            event.modified_by,
            event.user_name
          ],
          function (err: any) {
            if (err) {
              console.error('Error inserting configuration event:', err)
              return reject({ success: false, err, message: 'Insert configuration event failed' })
            }
            return resolve({
              success: true,
              data: event,
              message: 'Insert configuration event completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Insert configuration event transaction failed'
        })
      })
  })
}

export const insertConfigurationEventArrayTransaction = async (eventArray: any[], dbsql: any) => {
  if (!Array.isArray(eventArray) || eventArray.length === 0) {
    return { success: true, message: 'No configuration events to insert', inserted: 0 }
  }

  try {
    let insertedCount = 0
    for (const event of eventArray) {
      const result: any = await insertConfigurationEventTransaction(event, dbsql)
      if (!result.success) {
        throw result.err || new Error('Insert failed')
      }
      insertedCount++
    }

    return {
      success: true,
      inserted: insertedCount,
      message: 'Inserted configuration events successfully'
    }
  } catch (err) {
    console.error('Error inserting configuration event array:', err)
    return { success: false, err, message: 'Insert configuration event array failed' }
  }
}

export const getConfigurationEventById = async (mrid: string) => {
  try {
    const activityResult: any = await activityRecordFunc.getActivityRecordById(mrid)
    if (!activityResult.success) {
      return { success: false, data: null, message: 'Activity record not found' }
    }
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM configuration_event WHERE mrid = ?', [mrid], (err: any, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get configuration event failed' })
        if (!row)
          return resolve({ success: false, data: null, message: 'Configuration event not found' })
        const data = { ...activityResult.data, ...row }
        return resolve({ success: true, data: data, message: 'Get configuration event completed' })
      })
    })
  } catch (err) {
    return { success: false, err, message: 'Get configuration event failed' }
  }
}

export const getAllConfigurationEvents = async () => {
  try {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT 
                    ce.*, 
                    ar.type,
                    ar.created_date_time,
                    io.name,
                    io.description AS description
                FROM configuration_event ce
                JOIN activity_record ar ON ce.mrid = ar.mrid
                JOIN identified_object io ON ar.mrid = io.mrid
            `

      db.all(query, [], (err: any, rows: any) => {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Get configuration events failed'
          })
        }

        return resolve({
          success: true,
          data: rows,
          message: 'Get configuration events completed'
        })
      })
    })
  } catch (err) {
    return {
      success: false,
      err,
      message: 'Unexpected error when getting configuration events'
    }
  }
}

export const updateConfigurationEventById = async (mrid: string, event: any) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      activityRecordFunc
        .updateActivityRecordByIdTransaction(mrid, event, db)
        .then((activityResult: any) => {
          if (!activityResult.success) {
            db.run('ROLLBACK')
            return reject({
              success: false,
              message: 'Update activity record failed',
              err: activityResult.err
            })
          }
          db.run(
            `UPDATE configuration_event SET
                            effective_date_time = ?,
                            remark = ?,
                            power_system_resource = ?,
                            changed_location = ?,
                            changed_asset = ?,
                            changed_organisation_role = ?,
                            changed_organisation = ?,
                            changed_person_role = ?,
                            changed_person = ?,
                            changed_attachment = ?,
                            modified_by = ?,
                            user_name = ?
                         WHERE mrid = ?`,
            [
              event.effective_date_time,
              event.remark,
              event.power_system_resource,
              event.changed_location,
              event.changed_asset,
              event.changed_organisation_role,
              event.changed_organisation,
              event.changed_person_role,
              event.changed_person,
              event.changed_attachment,
              event.modified_by,
              event.user_name,
              mrid
            ],
            function (err: any) {
              if (err) {
                db.run('ROLLBACK')
                return reject({ success: false, err, message: 'Update configuration event failed' })
              }
              db.run('COMMIT')
              return resolve({
                success: true,
                data: event,
                message: 'Update configuration event completed'
              })
            }
          )
        })
        .catch((err: any) => {
          db.run('ROLLBACK')
          return reject({
            success: false,
            err,
            message: 'Update configuration event transaction failed'
          })
        })
    })
  })
}

export const updateConfigurationEventByIdTransaction = async (
  mrid: string,
  event: any,
  dbsql: any
) => {
  return new Promise((resolve, reject) => {
    activityRecordFunc
      .updateActivityRecordByIdTransaction(mrid, event, dbsql)
      .then((activityResult: any) => {
        if (!activityResult.success) {
          return reject({
            success: false,
            message: 'Update activity record failed',
            err: activityResult.err
          })
        }
        dbsql.run(
          `UPDATE configuration_event SET
                        effective_date_time = ?,
                        remark = ?,
                        power_system_resource = ?,
                        changed_location = ?,
                        changed_asset = ?,
                        changed_organisation_role = ?,
                        changed_organisation = ?,
                        changed_person_role = ?,
                        changed_person = ?,
                        changed_attachment = ?,
                        modified_by = ?,
                        user_name = ?
                     WHERE mrid = ?`,
          [
            event.effective_date_time,
            event.remark,
            event.power_system_resource,
            event.changed_location,
            event.changed_asset,
            event.changed_organisation_role,
            event.changed_organisation,
            event.changed_person_role,
            event.changed_person,
            event.changed_attachment,
            event.modified_by,
            event.user_name,
            mrid
          ],
          function (err: any) {
            if (err) {
              return reject({ success: false, err, message: 'Update configuration event failed' })
            }
            return resolve({
              success: true,
              data: event,
              message: 'Update configuration event completed'
            })
          }
        )
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Update configuration event transaction failed'
        })
      })
  })
}

export const deleteConfigurationEventById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    activityRecordFunc
      .deleteActivityRecordByIdTransaction(mrid, db)
      .then((result: any) => {
        if (!result.success) {
          return reject({
            success: false,
            message: 'Delete activity record failed',
            err: result.err
          })
        }
        return resolve({
          success: true,
          message: 'Delete configuration event (and activity record) completed'
        })
      })
      .catch((err: any) => {
        return reject({
          success: false,
          err,
          message: 'Delete configuration event transaction failed'
        })
      })
  })
}

export const deleteConfigurationEventByIdTransaction = async (mrid: string, dbsql: any) => {
  return activityRecordFunc.deleteActivityRecordByIdTransaction(mrid, dbsql)
}
