import { v4 as newUuid } from 'uuid'
import db from '../datacontext/index'

export const getAttachmentByForeignIdAndType = async (id_foreign: string, type: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM attachment where id_foreign=? and type=?',
      [id_foreign, type],
      (err: Error | null, row: unknown) => {
        if (err) return reject({ success: false, err: err, message: 'Get all attachments failed' })
        if (!row) return resolve({ success: false, data: null, message: 'Attachment not found' })
        return resolve({ success: true, data: row, message: 'Get all attachments completed' })
      }
    )
  })
}

export const getAttachmentById = async (id: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM attachment where id=?', [id], (err: Error | null, row: unknown) => {
      if (err) return reject({ success: false, err: err, message: 'Get attachment by id failed' })
      if (!row) return resolve({ success: false, data: null, message: 'Attachment not found' })
      return resolve({ success: true, data: row, message: 'Get attachment by id completed' })
    })
  })
}

export const updateAttachmentById = async (
  id: string,
  attachment: { path: string; name: unknown; type: string; id_foreign: string }
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE attachment
             SET path = ?, name = ?, type = ?, id_foreign = ?
             WHERE id = ?`,
      [attachment.path, attachment.name, attachment.type, attachment.id_foreign, id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update attachment failed' })
        return resolve({ success: true, data: attachment, message: 'Update attachment completed' })
      }
    )
  })
}

export const uploadAttachment = async (attachment: {
  id?: string
  id_foreign: string
  type: string
  name: unknown
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO attachment(id, id_foreign, type, name)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               id_foreign = excluded.id_foreign,
               type = excluded.type,
               name = excluded.name`,
      [
        attachment.id || newUuid(),
        attachment.id_foreign,
        attachment.type,
        JSON.stringify(attachment.name)
      ],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Upload attachment failed' })
        return resolve({ success: true, data: attachment, message: 'Upload attachment completed' })
      }
    )
  })
}

export const deleteAttachmentById = (id: string) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM attachment WHERE id = ?', [id], (err: Error | null) => {
      if (err) return reject({ success: false, err, message: 'Delete attachment failed' })
      return resolve({ success: true, data: id, message: 'Delete attachment completed' })
    })
  })
}
