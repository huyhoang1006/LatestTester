import path from 'path'
import fs from 'fs'
import { app } from 'electron'

const CONFIG_FILE = 'db-config.json'

function getConfigPath(): string {
  return path.join(app.getPath('userData'), CONFIG_FILE)
}

function loadConfig(): Record<string, string> {
  const configPath = getConfigPath()
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    } catch {
      return {}
    }
  }
  return {}
}

function saveConfig(config: Record<string, string>): void {
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2))
}

export function getDBPassword(): string {
  const envPassword = process.env.DB_PASSWORD
  if (envPassword) return envPassword

  const config = loadConfig()
  if (config.DB_PASSWORD) return config.DB_PASSWORD

  return 'attester'
}

export function setDBPassword(password: string): void {
  const config = loadConfig()
  config.DB_PASSWORD = password
  saveConfig(config)
}
