import fs from 'fs'
import { templateFunc } from '../entity/template'

export const uploadFunc: any = {
  uploadCustom: async (filePath: string, name: string) => {
    try {
      const exists = await templateFunc.getTemplateByName(name)
      if (exists && exists.success && exists.data) {
        const updateRes = await templateFunc.updateTemplate({
          name,
          path: filePath,
          variable: JSON.stringify([]),
          type: 'excel',
          category: 'import'
        })
        return updateRes.success ? filePath : null
      } else {
        const insertRes = await templateFunc.insertTemplate({
          name,
          path: filePath,
          variable: JSON.stringify([]),
          type: 'excel',
          category: 'import'
        })
        return insertRes.success ? filePath : null
      }
    } catch (e: any) {
      console.error('[uploadFunc] uploadCustom error:', e.message)
      return null
    }
  },

  getNameTemplate: async () => {
    try {
      const rs = await templateFunc.getAllTemplates()
      if (rs && rs.success && rs.data) {
        return rs.data.map((t: any) => t.name)
      }
      return []
    } catch (e: any) {
      console.error('[uploadFunc] getNameTemplate error:', e.message)
      return []
    }
  },

  uploadReport: async (
    filePath: string,
    name: string,
    _asset: unknown,
    _location: unknown,
    _job: unknown,
    _user_id: string
  ) => {
    try {
      const ext = filePath.split('.').pop()?.toLowerCase() || 'xlsx'
      const exists = await templateFunc.getTemplateByName(name)
      if (exists && exists.success && exists.data) {
        return await templateFunc.updateTemplate({
          name,
          path: filePath,
          variable: JSON.stringify([]),
          type: ext,
          category: 'report'
        })
      } else {
        return await templateFunc.insertTemplate({
          name,
          path: filePath,
          variable: JSON.stringify([]),
          type: ext,
          category: 'report'
        })
      }
    } catch (e: any) {
      console.error('[uploadFunc] uploadReport error:', e.message)
      return { success: false, message: e.message }
    }
  },

  getTemplateByName: async (name: string) => {
    try {
      return await templateFunc.getTemplateByName(name)
    } catch (e: any) {
      console.error('[uploadFunc] getTemplateByName error:', e.message)
      return null
    }
  },

  deleteTempByName: async (name: string) => {
    try {
      return await templateFunc.deleteTemplate(name)
    } catch (e: any) {
      console.error('[uploadFunc] deleteTempByName error:', e.message)
    }
  },

  updateTemplateByName: async (data: any) => {
    try {
      return await templateFunc.updateTemplate(data)
    } catch (e: any) {
      console.error('[uploadFunc] updateTemplateByName error:', e.message)
    }
  },

  getColumnByName: async (name: string) => {
    try {
      const rs = await templateFunc.getTemplateByName(name)
      if (rs && rs.success && rs.data && rs.data.variable) {
        const variables = JSON.parse(rs.data.variable)
        return variables.map((v: any) => v.code).filter(Boolean)
      }
      return []
    } catch (e: any) {
      console.error('[uploadFunc] getColumnByName error:', e.message)
      return []
    }
  },

  saveTemplate: async (data: any) => {
    try {
      const exists = await templateFunc.getTemplateByName(data.name)
      if (exists && exists.success && exists.data) {
        return await templateFunc.updateTemplate({
          name: data.name,
          path: data.path,
          variable: typeof data.var === 'string' ? data.var : JSON.stringify(data.var || []),
          type: data.type || 'excel',
          category: data.category || 'import'
        })
      } else {
        return await templateFunc.insertTemplate({
          name: data.name,
          path: data.path,
          variable: typeof data.var === 'string' ? data.var : JSON.stringify(data.var || []),
          type: data.type || 'excel',
          category: data.category || 'import'
        })
      }
    } catch (e: any) {
      console.error('[uploadFunc] saveTemplate error:', e.message)
      return { success: false, message: e.message }
    }
  },

  readVarFromJson: async (filePath: string) => {
    try {
      const text = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(text)
    } catch (e: any) {
      console.error('[uploadFunc] readVarFromJson error:', e.message)
      return {}
    }
  },

  exportReport: async (
    _file: any,
    _destPath: string,
    _location: any,
    _assetType: string,
    _asset: any,
    _job: any,
    _test: any,
    _user_id: string,
    _bushing: any,
    _tap_changer: any
  ) => {
    console.warn(
      '[uploadFunc] exportReport - full implementation requires Excel/Word templating library integration'
    )
    return {
      success: false,
      message:
        'exportReport requires full Excel template filling - see ipcmain/entity/template/index.ts exportTemplateWithData'
    }
  }
}

export const locationUploadFunc: any = {
  handleDataLocation: async (filePath: string, varData: any) => {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        console.warn('[locationUploadFunc] handleDataLocation: file not found', filePath)
        return varData
      }
      const XlsxPopulate = require('xlsx-populate')
      const wb = await XlsxPopulate.fromFileAsync(filePath)
      const codes = Array.isArray(varData) ? varData.map((v: any) => v.code).filter(Boolean) : []

      const extractValue = (currentStr: string, code: string): string => {
        const codeTrimmed = code.trim()
        if (currentStr === codeTrimmed || currentStr === `{${codeTrimmed}}`) return ''
        const codeRegex = new RegExp(
          '(?<![A-Za-z0-9])\\{?' +
            codeTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '\\}?(?![A-Za-z0-9])',
          'g'
        )
        if (codeRegex.test(currentStr)) {
          codeRegex.lastIndex = 0
          return currentStr.replace(codeRegex, () => '').trim()
        }
        return ''
      }

      const codeMatchesCell = (strVal: string, code: string): boolean => {
        const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const tokenRegex = new RegExp('(?<![A-Za-z0-9])' + escapedCode + '(?![A-Za-z0-9])')
        return tokenRegex.test(strVal)
      }

      wb.sheets().forEach((sheet: any) => {
        const usedRange = sheet.usedRange()
        if (!usedRange) return
        usedRange.cells().forEach((rowCells: any[]) => {
          rowCells.forEach((cell: any) => {
            const val = cell.value()
            if (val === null || val === undefined) return
            const strVal = String(val)
            codes.forEach((code: string) => {
              if (codeMatchesCell(strVal, code)) {
                const extracted = extractValue(strVal, code)
                const variable = varData.find((v: any) => v.code === code)
                if (variable) {
                  if (!variable.values) variable.values = []
                  variable.values.push(extracted)
                }
              }
            })
          })
        })
      })

      return varData
    } catch (e: any) {
      console.error('[locationUploadFunc] handleDataLocation error:', e.message)
      return varData
    }
  },

  handleDataWord: async (filePath: string, varData: any) => {
    try {
      if (!filePath || !fs.existsSync(filePath)) {
        console.warn('[locationUploadFunc] handleDataWord: file not found', filePath)
        return varData
      }
      const PizZip = require('pizzip')
      const buffer = fs.readFileSync(filePath)
      const zip = new PizZip(buffer)
      const xml = zip.file('word/document.xml').asText()
      const codes = Array.isArray(varData) ? varData.map((v: any) => v.code).filter(Boolean) : []

      const getText = (fragment: string): string => {
        const matches: string[] = []
        const re = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g
        let m: RegExpExecArray | null
        while ((m = re.exec(fragment)) !== null) matches.push(m[1])
        return matches.join('')
      }

      const allText: string[] = []
      const tcRe = /<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g
      let tcM: RegExpExecArray | null
      while ((tcM = tcRe.exec(xml)) !== null) allText.push(getText(tcM[1]))
      const xmlNoTbl = xml.replace(/<w:tbl\b[^>]*>[\s\S]*?<\/w:tbl>/g, '')
      const bodyM = xmlNoTbl.match(/<w:body\b[^>]*>([\s\S]*?)<\/w:body>/)
      if (bodyM) {
        const pRe = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g
        let pM: RegExpExecArray | null
        while ((pM = pRe.exec(bodyM[1])) !== null) allText.push(getText(pM[1]))
      }

      for (const code of codes) {
        const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const phRegex = new RegExp('\\{' + escapedCode + '\\}', 'g')
        for (const text of allText) {
          if (phRegex.test(text)) {
            const extracted = text.replace(phRegex, '').trim()
            if (extracted) {
              const variable = varData.find((v: any) => v.code === code)
              if (variable) {
                if (!variable.values) variable.values = []
                variable.values.push(extracted)
              }
            }
          }
        }
      }

      return varData
    } catch (e: any) {
      console.error('[locationUploadFunc] handleDataWord error:', e.message)
      return varData
    }
  }
}
