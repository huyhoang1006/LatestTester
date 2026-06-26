import db from '../../datacontext/index.js'

export const getAllNotifications = async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM notification ORDER BY mrid DESC', [], (err: Error | null, rows: unknown[]) => {
            if (err) reject(err)
            else resolve({ success: true, data: rows, message: 'Notifications retrieved successfully' })
        })
    })
}

export const getNotificationById = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM notification WHERE mrid = ?', [mrid], (err: Error | null, row: unknown) => {
            if (err) reject(err)
            else if (row) resolve({ success: true, data: row, message: 'Notification retrieved successfully' })
            else resolve({ success: false, message: 'Notification not found' })
        })
    })
}

export const insertNotification = async (entity: { mrid: string; name: string | null; message: string | null; type: string | null; status?: string; created_at?: string }) => {
    const versionMatch = entity.message && entity.message.match(/Version\s+(\S+)/)
    if (versionMatch) {
        const version = versionMatch[1]
        const existing = await checkUpdateNotificationExists(version)
        if (existing) {
            return { success: false, data: existing, message: 'Update notification already exists', duplicate: true }
        }
    }

    const createdAt = entity.created_at || new Date().toISOString()
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO notification (mrid, name, message, type, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [entity.mrid, entity.name, entity.message, entity.type, entity.status || 'unread', createdAt],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) reject(err)
                else resolve({ success: true, data: { ...entity, created_at: createdAt }, message: 'Notification inserted successfully' })
            }
        )
    })
}

export const checkUpdateNotificationExists = async (version: string) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM notification WHERE message LIKE ?',
            [`%${version}%`],
            (err: Error | null, row: unknown) => {
                if (err) reject(err)
                else resolve(row || null)
            }
        )
    })
}

export const updateNotification = async (mrid: string, entity: { name: string | null; message: string | null; type: string | null; status?: string }) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE notification SET name = ?, message = ?, type = ?, status = ? WHERE mrid = ?',
            [entity.name, entity.message, entity.type, entity.status, mrid],
            function (this: { lastID: number; changes: number }, err: Error | null) {
                if (err) reject(err)
                else resolve({ success: true, data: entity, message: 'Notification updated successfully' })
            }
        )
    })
}

export const markAsRead = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE notification SET status = ? WHERE mrid = ?', ['read', mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) reject(err)
            else resolve({ success: true, message: 'Notification marked as read' })
        })
    })
}

export const hmrideNotification = async (mrid: string) => {
    return hideNotification(mrid)
}

export const hideNotification = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE notification SET status = ? WHERE mrid = ?', ['hidden', mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) reject(err)
            else resolve({ success: true, message: 'Notification hidden successfully' })
        })
    })
}

export const deleteNotification = async (mrid: string) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM notification WHERE mrid = ?', [mrid], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) reject(err)
            else resolve({ success: true, message: 'Notification deleted successfully' })
        })
    })
}

export const deleteAllNotifications = async () => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM notification', [], function (this: { lastID: number; changes: number }, err: Error | null) {
            if (err) reject(err)
            else resolve({ success: true, message: 'All notifications deleted successfully' })
        })
    })
}
