import { ipcMain } from 'electron'
import axios from 'axios'

export interface AuthHttpRequest {
  url: string
  data: string
  headers: Record<string, string>
  timeout?: number
}

export interface AuthHttpResponse {
  success: boolean
  status?: number
  data?: unknown
  message?: string
}

/**
 * Performs the OAuth token request (login / refresh) from the main process instead of the
 * renderer. Node's http client isn't subject to the browser's CORS/preflight checks that a
 * renderer XHR is (webSecurity: true), so this avoids depending on the backend supporting CORS.
 */
export const authRequest = (): void => {
  ipcMain.handle(
    'auth:request',
    async (_event, config: AuthHttpRequest): Promise<AuthHttpResponse> => {
      try {
        const response = await axios.post(config.url, config.data, {
          headers: config.headers,
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
    }
  )
}

export const active = (): void => {
  authRequest()
}
