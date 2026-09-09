import { ipcMain } from 'electron'
import axios from 'axios'

export interface ApiRequest {
  method?: string
  url: string
  headers?: Record<string, string>
  data?: unknown
  params?: unknown
  timeout?: number
}

export interface ApiResponse {
  success: boolean
  status?: number
  data?: unknown
  message?: string
}

/**
 * Generic API proxy via main process (Node http) — bypasses CORS/webSecurity
 * for service domain (30830) when renderer runs with webSecurity:true.
 * Mirrors authRequest pattern but supports all methods.
 */
export const apiProxy = (): void => {
  ipcMain.handle('api:request', async (_event, config: ApiRequest): Promise<ApiResponse> => {
    // Handle relative URLs passed from Vite proxy fallback — prepend nothing, require absolute
    // Caller (client.js) always sends absolute URL (baseURL + url), so just forward.
    const url = config.url
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return { success: false, message: `Invalid URL: ${url}` }
    }
    try {
      const response = await axios({
        method: (config.method || 'GET') as never,
        url,
        headers: config.headers as never,
        data: config.data as never,
        params: config.params as never,
        timeout: config.timeout || 20000
      })
      return { success: true, status: response.status, data: response.data }
    } catch (error) {
      const err = error as { response?: { status?: number; data?: unknown }; message?: string }
      return {
        success: false,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message || 'Network Error'
      }
    }
  })
}

export const active = (): void => {
  apiProxy()
}
