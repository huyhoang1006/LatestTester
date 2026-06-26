import uuid from '@/utils/uuid'

export const importSurgeArrester: any = async (dto: any, parentNode: any, { electronAPI, mappings }: any) => {
    try {
        if (parentNode?.mode && parentNode.mode !== 'substation' && parentNode.mode !== 'bay' && parentNode.mode !== 'surgeArrester') {
            return {
                success: false,
                message: 'SurgeArrester can only be imported under Substation, Bay or SurgeArrester'
            }
        }

        const entity: any = mappings.SurgeArresterMapping.mapDtoToEntity(dto) || {}
        entity.surgeArrester ??= {}

        const newMrid = uuid.newUuid()
        entity.surgeArrester.mrid = newMrid

        const newLifecycleDateMrid = uuid.newUuid()
        entity.lifecycleDate ??= {}
        entity.lifecycleDate.mrid = newLifecycleDateMrid
        entity.surgeArrester.lifecycle_date = newLifecycleDateMrid

        const newProductAssetModelMrid = uuid.newUuid()
        entity.productAssetModel ??= {}
        entity.productAssetModel.mrid = newProductAssetModelMrid
        entity.surgeArrester.product_asset_model = newProductAssetModelMrid

        entity.surgeArrester.location = null

        if (parentNode?.mrid) {
            entity.assetPsr = {
                mrid: uuid.newUuid(),
                asset_id: newMrid,
                psr_id: parentNode.mrid
            }
        } else {
            entity.assetPsr = {
                mrid: uuid.newUuid(),
                asset_id: newMrid,
                psr_id: null
            }
        }

        const ensureArray = (obj: any, key: string) => {
            if (!Array.isArray(obj[key])) obj[key] = []
        }

        ensureArray(entity, 'voltage')
        ensureArray(entity, 'seconds')
        ensureArray(entity, 'currentFlow')
        ensureArray(entity, 'oldSurgeArresterInfo')

        for (const voltage of entity.voltage) {
            voltage.mrid = uuid.newUuid()
        }

        for (const second of entity.seconds) {
            second.mrid = uuid.newUuid()
        }

        for (const current of entity.currentFlow) {
            current.mrid = uuid.newUuid()
        }

        let voltageIndex = 0
        let secondsIndex = 0
        let currentFlowIndex = 0

        for (const info of entity.oldSurgeArresterInfo) {
            info.mrid = uuid.newUuid()
            info.surge_arrester_id = newMrid
            info.product_asset_model = newProductAssetModelMrid

            if (entity.voltage[voltageIndex]) {
                info.rated_voltage = entity.voltage[voltageIndex].mrid
                voltageIndex++
            }
            if (entity.voltage[voltageIndex]) {
                info.maximum_system_voltage = entity.voltage[voltageIndex].mrid
                voltageIndex++
            }
            if (entity.voltage[voltageIndex]) {
                info.continuous_operating_voltage = entity.voltage[voltageIndex].mrid
                voltageIndex++
            }
            if (entity.voltage[voltageIndex]) {
                info.pf_with_stand_voltage_earth_between_pole = entity.voltage[voltageIndex].mrid
                voltageIndex++
            }
            if (entity.voltage[voltageIndex]) {
                info.pf_with_stand_voltage_isolated_distance = entity.voltage[voltageIndex].mrid
                voltageIndex++
            }

            if (entity.currentFlow[currentFlowIndex]) {
                info.short_time_with_stand_current = entity.currentFlow[currentFlowIndex].mrid
                currentFlowIndex++
            }

            if (entity.seconds[secondsIndex]) {
                info.rated_duration_of_short_circuit = entity.seconds[secondsIndex].mrid
                secondsIndex++
            }
        }

        entity.attachment = {
            id: null,
            name: null,
            path: '[]',
            type: 'asset',
            id_foreign: newMrid
        }

        const old_entity = {
            voltage: [],
            seconds: [],
            currentFlow: [],
            oldSurgeArresterInfo: []
        }

        const result: any = await electronAPI.insertSurgeArresterEntity(old_entity, entity)
        return {
            ...result,
            entity
        }
    } catch (error: any) {
        console.error('Error importing surge arrester:', error)
        return { success: false, message: error?.message || 'Import Surge Arrester failed' }
    }
}

export const deleteSurgeArrester: any = async (mrid: string, psrId: string, { electronAPI }: any) => {
    try {
        if (!mrid) {
            return { success: false, message: 'MRID is required' }
        }

        const entityRes: any = await electronAPI.getSurgeArresterEntityByMrid(mrid, psrId)
        if (!entityRes.success || !entityRes.data) {
            return { success: false, message: 'SurgeArrester not found' }
        }

        const result: any = await electronAPI.deleteSurgeArresterEntity(entityRes.data)
        return result
    } catch (error: any) {
        console.error('Error deleting surge arrester:', error)
        return { success: false, message: error?.message || 'Delete Surge Arrester failed' }
    }
}