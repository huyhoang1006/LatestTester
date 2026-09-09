// src/function/cim/license/index.ts
import db from '../../datacontext/index'

interface LicenseItem {
  name: string
  limit: number
}

export const initLicenseLimitation = () => {
  const defaultLicenses: LicenseItem[] = [
    { name: 'Organisation', limit: 999999999 },
    { name: 'Substation', limit: 999999999 },
    { name: 'Voltage Level', limit: 999999999 },
    { name: 'Bay', limit: 999999999 },
    { name: 'Transformer', limit: 999999999 },
    { name: 'Power cable', limit: 999999999 },
    { name: 'Circuit breaker', limit: 999999999 },
    { name: 'Current transformer', limit: 999999999 },
    { name: 'Voltage transformer', limit: 999999999 },
    { name: 'Disconnector', limit: 999999999 },
    { name: 'Bushing', limit: 999999999 },
    { name: 'Reactor', limit: 999999999 },
    { name: 'Capacitor', limit: 999999999 },
    { name: 'Rotating machine', limit: 999999999 },
    { name: 'Surge Arrester', limit: 999999999 }
  ]

  db.serialize(() => {
    defaultLicenses.forEach((item) => {
      const fixedMrid = `LIC_${item.name.toUpperCase().replace(/\s+/g, '_')}`

      db.get(
        'SELECT number_of_liscense FROM limitation_license WHERE mrid = ?',
        [fixedMrid],
        (err: Error | null, row: any) => {
          if (err) return

          if (row) {
            if (row.number_of_liscense !== item.limit) {
              db.run(
                'UPDATE limitation_license SET number_of_liscense = ?, name = ? WHERE mrid = ?',
                [item.limit, item.name, fixedMrid],
                () => {}
              )
            }
          } else {
            db.run(
              'INSERT INTO limitation_license (name, number_of_liscense, mrid) VALUES (?, ?, ?)',
              [item.name, item.limit, fixedMrid],
              () => {}
            )
          }
        }
      )
    })
  })
}

export const updateLicenseLimit = (name: string, limit: number) => {
  return new Promise((resolve, reject) => {
    const mrid = `LIC_${name.toUpperCase().replace(/\s+/g, '_')}`
    db.run(
      'UPDATE limitation_license SET number_of_liscense = ? WHERE name = ?',
      [limit, name],
      function (this: any, err: Error | null) {
        if (err) return reject({ success: false, message: err.message })
        if (this.changes === 0) {
          db.run(
            'INSERT INTO limitation_license (name, number_of_liscense, mrid) VALUES (?, ?, ?)',
            [name, limit, mrid],
            (insErr: Error | null) => {
              if (insErr) return reject({ success: false, message: insErr.message })
              resolve({ success: true, message: `License "${name}" created with limit ${limit}` })
            }
          )
        } else {
          resolve({ success: true, message: `License "${name}" updated to limit ${limit}` })
        }
      }
    )
  })
}

export const checkLicenseLimitation = (name: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT number_of_liscense FROM limitation_license WHERE name = ?',
      [name],
      (err: Error | null, row: any) => {
        if (err) return reject({ success: false, message: 'Database error' })
        if (!row) return resolve({ success: true, allowed: true })

        const limit = row.number_of_liscense
        let countQuery = ''
        let params: unknown[] = []

        if (name === 'Organisation') countQuery = 'SELECT COUNT(*) as total FROM organisation'
        else if (name === 'Substation') countQuery = 'SELECT COUNT(*) as total FROM substation'
        else if (name === 'Voltage Level')
          countQuery = 'SELECT COUNT(*) as total FROM voltage_level'
        else if (name === 'Bay') countQuery = 'SELECT COUNT(*) as total FROM bay'
        else {
          countQuery = 'SELECT COUNT(*) as total FROM asset WHERE kind = ?'
          params = [name]
        }

        db.get(countQuery, params, (countErr: Error | null, countRow: any) => {
          if (countErr) return reject({ success: false, message: 'Count error' })
          const current = countRow.total
          if (current >= limit) {
            resolve({
              success: true,
              allowed: false,
              message: `License Limit Reached: Only ${limit} ${name}(s) allowed. (Current: ${current})`
            })
          } else {
            resolve({ success: true, allowed: true })
          }
        })
      }
    )
  })
}
