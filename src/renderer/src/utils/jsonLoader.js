import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'

export function loadJsonFiles(dir) {
    const files = readdirSync(dir).filter(f => f.endsWith('.json'))
    return files.reduce((acc, file) => {
        const name = file.replace('.json', '')
        const filePath = join(dir, file)
        const content = JSON.parse(readFileSync(filePath, 'utf-8'))
        acc[name] = content
        return acc
    }, {})
}

export function loadJsonFilesFromContext(dir) {
    try {
        return loadJsonFiles(dir)
    } catch (e) {
        console.warn('loadJsonFilesFromContext failed:', e.message)
        return {}
    }
}