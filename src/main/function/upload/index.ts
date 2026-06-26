export const uploadFunc = {
    uploadCustom: async (_filePath: string, _name: string) => {
        console.log('[uploadFunc] uploadCustom called - not fully implemented')
        throw new Error('uploadFunc.uploadCustom not implemented')
    },
    getNameTemplate: async () => {
        console.log('[uploadFunc] getNameTemplate called - not fully implemented')
        return [] as string[]
    },
    uploadReport: async (_filePath: string, _name: string, _asset: unknown, _location: unknown, _job: unknown, _user_id: string) => {
        console.log('[uploadFunc] uploadReport called - not fully implemented')
        throw new Error('uploadFunc.uploadReport not implemented')
    },
    getTemplateByName: async (_name: string) => {
        console.log('[uploadFunc] getTemplateByName called - not fully implemented')
        return null
    },
    deleteTempByName: async (_name: string) => {
        console.log('[uploadFunc] deleteTempByName called - not fully implemented')
    },
    updateTemplateByName: async (_data: unknown) => {
        console.log('[uploadFunc] updateTemplateByName called - not fully implemented')
    },
    getColumnByName: async (_name: string) => {
        console.log('[uploadFunc] getColumnByName called - not fully implemented')
        return [] as string[]
    },
    saveTemplate: async (_data: unknown) => {
        console.log('[uploadFunc] saveTemplate called - not fully implemented')
    },
    readVarFromJson: async (_filePath: string) => {
        console.log('[uploadFunc] readVarFromJson called - not fully implemented')
        return {} as Record<string, unknown>
    },
    exportReport: async (
        _file: unknown,
        _destPath: string,
        _location: unknown,
        _assetType: string,
        _asset: unknown,
        _job: unknown,
        _test: unknown,
        _user_id: string,
        _bushing: unknown,
        _tap_changer: unknown
    ) => {
        console.log('[uploadFunc] exportReport called - not fully implemented')
        throw new Error('uploadFunc.exportReport not implemented')
    }
}

export const locationUploadFunc = {
    handleDataLocation: async (_filePath: string, varData: unknown) => {
        console.log('[locationUploadFunc] handleDataLocation called - not fully implemented')
        return varData
    },
    handleDataWord: async (_filePath: string, varData: unknown) => {
        console.log('[locationUploadFunc] handleDataWord called - not fully implemented')
        return varData
    }
}
