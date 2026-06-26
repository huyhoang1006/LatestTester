import path from 'path'
import { app } from 'electron'
import fs from 'fs'

let templateDir: string

if (process.env.NODE_ENV === 'development') {
    templateDir = path.join(__dirname, '/../template')
} else {
    templateDir = path.join(app.getPath('userData'), 'template')
}

if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true })
}

export function getTemplatePath(filename: string): string {
    return path.join(templateDir, filename)
}

export function getTemplateDir(): string {
    return templateDir
}
