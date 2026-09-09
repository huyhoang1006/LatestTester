import path from 'path'
import { app } from 'electron'
import fs from 'fs'

let attachmentDir: string

if (process.env.NODE_ENV === 'development') {
  attachmentDir = path.join(__dirname, '/../attachment')
} else {
  attachmentDir = path.join(app.getPath('userData'), 'attachment')
}

if (!fs.existsSync(attachmentDir)) {
  fs.mkdirSync(attachmentDir, { recursive: true })
}

export function getAttachmentPath(filename: string): string {
  return path.join(attachmentDir, filename)
}

export function getAttachmentDir(): string {
  return attachmentDir
}
