import db from '../../datacontext/index'

export const getTransformerObservationProcedureDataSetById = async (mrid: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM transformerObservationProcedureDataSet WHERE mrid=?`,
      [mrid],
      (err: Error | null, row: unknown) => {
        if (err)
          return reject({
            success: false,
            err,
            message: 'Get transformerObservationProcedureDataSet by id failed'
          })
        if (!row)
          return resolve({
            success: false,
            data: null,
            message: 'TransformerObservationProcedureDataSet not found'
          })
        return resolve({
          success: true,
          data: row,
          message: 'Get transformerObservationProcedureDataSet by id completed'
        })
      }
    )
  })
}

export const insertTransformerObservationProcedureDataSetTransaction = async (
  dataSet: { mrid: string; transformer_observation_id: string; procedure_dataset_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO transformerObservationProcedureDataSet(
                mrid, transformer_observation_id, procedure_dataset_id
            ) VALUES (?, ?, ?)
            ON CONFLICT(mrid) DO UPDATE SET
                transformer_observation_id = excluded.transformer_observation_id,
                procedure_dataset_id = excluded.procedure_dataset_id
            `,
      [dataSet.mrid, dataSet.transformer_observation_id, dataSet.procedure_dataset_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Insert transformerObservationProcedureDataSet failed'
          })
        }
        return resolve({
          success: true,
          data: dataSet,
          message: 'Insert transformerObservationProcedureDataSet completed'
        })
      }
    )
  })
}

export const updateTransformerObservationProcedureDataSetByIdTransaction = async (
  mrid: string,
  dataSet: { transformer_observation_id: string; procedure_dataset_id: string },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `UPDATE transformerObservationProcedureDataSet SET
                transformer_observation_id = ?,
                procedure_dataset_id = ?
            WHERE mrid = ?`,
      [dataSet.transformer_observation_id, dataSet.procedure_dataset_id, mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Update transformerObservationProcedureDataSet failed'
          })
        }
        return resolve({
          success: true,
          data: dataSet,
          message: 'Update transformerObservationProcedureDataSet completed'
        })
      }
    )
  })
}

export const deleteTransformerObservationProcedureDataSetByIdTransaction = async (
  mrid: string,
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      'DELETE FROM transformerObservationProcedureDataSet WHERE mrid=?',
      [mrid],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          return reject({
            success: false,
            err,
            message: 'Delete transformerObservationProcedureDataSet failed'
          })
        }
        if (this.changes === 0)
          return resolve({
            success: false,
            data: null,
            message: 'TransformerObservationProcedureDataSet not found'
          })
        return resolve({
          success: true,
          data: null,
          message: 'Delete transformerObservationProcedureDataSet completed'
        })
      }
    )
  })
}
