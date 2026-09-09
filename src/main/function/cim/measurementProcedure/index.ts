import db from '../../datacontext/index'

export const insertMeasurementProcedureTransaction = async (
  info: { measurement_id: string; procedure_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO measurement_procedure(
                measurement_id, procedure_id
            ) VALUES (?, ?)
            ON CONFLICT(measurement_id, procedure_id) DO NOTHING
            `,
      [info.measurement_id, info.procedure_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          console.log('Error inserting measurementProcedure:', info)
          return reject({ success: false, err, message: 'Insert measurementProcedure failed' })
        }
        return resolve({
          success: true,
          data: info,
          message: 'Insert measurementProcedure completed'
        })
      }
    )
  })
}
