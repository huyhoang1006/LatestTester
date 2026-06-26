import uuid from '@/utils/uuid'

export const importBushing = async (dto: any, parentNode: any, { electronAPI, mappings }: { electronAPI: any; mappings: any }) => {
    try {
        if (!parentNode?.mode || !['substation', 'bay', 'bushing'].includes(parentNode.mode)) {
            return { success: false, message: 'Bushing can only be imported under Substation, Bay, or Bushing' }
        }

        const entity = mappings.BushingMapping.mapDtoToEntity(dto)
        if (!entity.bushing) {
            return { success: false, message: 'Failed to map DTO to a valid bushing entity.' }
        }

        let mustCreateNewMrid = false
        const parentMrid = parentNode?.mrid

        if (dto.clone === true) {
            mustCreateNewMrid = true
        } else if (!entity.bushing.mrid) {
            mustCreateNewMrid = true
        } else {
            const originalLocationId = entity.bushing.location || dto.locationId
            if (originalLocationId && originalLocationId !== parentMrid) {
                mustCreateNewMrid = true
            } else {
                try {
                    const existing = await electronAPI.getBushingEntityByMrid(entity.bushing.mrid)
                    if (!existing.success || !existing.data?.bushing) {
                        mustCreateNewMrid = true
                    }
                } catch {
                    mustCreateNewMrid = true
                }
            }
        }

        if (mustCreateNewMrid) {
            entity.bushing.mrid = uuid.newUuid()
        }

        entity.bushing.location = null
        entity.assetPsr = {
            mrid: uuid.newUuid(),
            asset_id: entity.bushing.mrid,
            psr_id: parentMrid || null
        }

        if (!entity.attachment) {
            entity.attachment = { id: null, path: '[]', name: null, type: 'asset', id_foreign: entity.bushing.mrid }
        } else {
            entity.attachment.path = entity.attachment.path || '[]'
        }
        entity.attachment.id_foreign = entity.bushing.mrid

        const result = await electronAPI.insertBushingEntity(entity)

        return { ...result, entity }
    } catch (error) {
        console.error('Error importing bushing:', error)
        return { success: false, message: (error as Error).message }
    }
}

export const deleteBushing = async (mrid: string, psrId: string, { electronAPI }: { electronAPI: any }) => {
    try {
        if (!mrid) {
            return { success: false, message: 'MRID is required for deletion' }
        }

        const entityRes = await electronAPI.getBushingEntityByMrid(mrid, psrId)
        if (!entityRes.success || !entityRes.data) {
            console.warn(`Bushing with mrid ${mrid} not found, assuming it's already deleted.`)
            return { success: true, message: 'Bushing not found, assumed already deleted.' }
        }

        const result = await electronAPI.deleteBushingEntity(entityRes.data)
        return result
    } catch (error) {
        console.error('Error deleting bushing:', error)
        return { success: false, message: (error as any)?.message || 'Delete Bushing failed' }
    }
}
