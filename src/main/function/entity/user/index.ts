import db from '../../datacontext/index'

export const insertUser = async (user: {
  user_id: string
  role: string | null
  permission: string | null
  username: string | null
  token: string | null
  group_user: string | null
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO user(
                user_id, role, permission, username, token, group_user
            ) VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                role = excluded.role,
                permission = excluded.permission,
                username = excluded.username,
                token = excluded.token,
                group_user = excluded.group_user`,
      [user.user_id, user.role, user.permission, user.username, user.token, user.group_user],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert user failed' })
        return resolve({ success: true, data: user, message: 'Insert user completed' })
      }
    )
  })
}

export const insertUserTransaction = async (
  user: {
    user_id: string
    role: string | null
    permission: string | null
    username: string | null
    token: string | null
    group_user: string | null
  },
  dbsql: typeof db
) => {
  return new Promise((resolve, reject) => {
    dbsql.run(
      `INSERT INTO user(
                user_id, role, permission, username, token, group_user
            ) VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                role = excluded.role,
                permission = excluded.permission,
                username = excluded.username,
                token = excluded.token,
                group_user = excluded.group_user`,
      [user.user_id, user.role, user.permission, user.username, user.token, user.group_user],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Insert user failed' })
        return resolve({ success: true, data: user, message: 'Insert user completed' })
      }
    )
  })
}

export const getUserById = async (user_id: string) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM user WHERE user_id = ?', [user_id], (err: Error | null, row: unknown) => {
      if (err) return reject({ success: false, err, message: 'Get user failed' })
      if (!row) return resolve({ success: false, data: null, message: 'User not found' })
      return resolve({ success: true, data: row, message: 'Get user completed' })
    })
  })
}

export const updateUserById = async (
  user_id: string,
  user: {
    role: string | null
    permission: string | null
    username: string | null
    token: string | null
    group_user: string | null
  }
) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE user SET
                role = ?,
                permission = ?,
                username = ?,
                token = ?,
                group_user = ?
            WHERE user_id = ?`,
      [user.role, user.permission, user.username, user.token, user.group_user, user_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Update user failed' })
        if (this.changes === 0) return resolve({ success: false, message: 'User not found' })
        return resolve({ success: true, data: user, message: 'Update user completed' })
      }
    )
  })
}

export const deleteUserById = async (user_id: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM user WHERE user_id = ?',
      [user_id],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) return reject({ success: false, err, message: 'Delete user failed' })
        if (this.changes === 0) return resolve({ success: false, message: 'User not found' })
        return resolve({ success: true, message: 'Delete user completed' })
      }
    )
  })
}
