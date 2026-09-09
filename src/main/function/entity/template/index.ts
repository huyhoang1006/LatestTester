import db from '../../datacontext/index'

export const templateFunc: any = {
  getAllTemplates: async () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM template ORDER BY name', [], (err: Error | null, rows: any[]) => {
        if (err) return reject({ success: false, err, message: 'Get templates failed' })
        return resolve({ success: true, data: rows })
      })
    })
  },

  getAllTemplatesByType: async (type: string, category: string) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM template WHERE type = ? AND category = ? ORDER BY name',
        [type, category],
        (err: Error | null, rows: any[]) => {
          if (err) return reject({ success: false, err, message: 'Get templates failed' })
          return resolve({ success: true, data: rows })
        }
      )
    })
  },

  getTemplateByName: async (name: string) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM template WHERE name = ?', [name], (err: Error | null, row: any) => {
        if (err) return reject({ success: false, err, message: 'Get template failed' })
        if (!row) return resolve({ success: false, data: null, message: 'Template not found' })
        return resolve({ success: true, data: row })
      })
    })
  },

  insertTemplate: async (template: any) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO template (name, path, variable, type, category) VALUES (?, ?, ?, ?, ?)`,
        [template.name, template.path, template.variable, template.type, template.category],
        function (this: any, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Insert template failed' })
          return resolve({ success: true, data: template, message: 'Insert template completed' })
        }
      )
    })
  },

  updateTemplate: async (template: any) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE template SET path = ?, variable = ?, type = ?, category = ? WHERE name = ?`,
        [template.path, template.variable, template.type, template.category, template.name],
        function (this: any, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update template failed' })
          return resolve({ success: true, data: template, message: 'Update template completed' })
        }
      )
    })
  },

  deleteTemplate: async (name: string) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM template WHERE name = ?',
        [name],
        function (this: any, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Delete template failed' })
          return resolve({ success: true, message: 'Delete template completed' })
        }
      )
    })
  },

  saveTemplateWithScan: async (payload: any) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE template SET path = ?, variable = ?, type = ?, category = ? WHERE name = ?`,
        [payload.path, payload.variable, payload.type, payload.category, payload.name],
        function (this: any, err: Error | null) {
          if (err) return reject({ success: false, err, message: 'Update template failed' })
          return resolve({
            success: true,
            data: payload,
            message: 'Save template with scan completed'
          })
        }
      )
    })
  }
}
