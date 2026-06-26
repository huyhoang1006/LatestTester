/* eslint-disable */
import { getCurrentTransformerById } from '@/api/demo/index.js'
import * as CurrentTransformerServerMapper from '@/views/Mapping/ServerToDTO/CurrentTransformer/index.js'
import * as CurrentTransformerMapper from '@/views/Mapping/CurrentTransformer/index.js'
import CurrentTransformerEntity from '@/views/Flatten/CurrentTransformer/index.js'
import { fetchWithRetry } from './core-utils.js'
import { detectConflicts, applyResolved, mergeWithoutSnapshot, CURRENT_TRANSFORMER_FIELD_DEFS } from '@/utils/conflictUtils.js'
import { showConflictDialog } from '@/store/conflictDialog'

export async function getCurrentTransformerChain(id, parentId) {
    try {
        const data = await fetchWithRetry(() => getCurrentTransformerById(id))
        return {
            currentTransformer: {
                id:          id,
                mrid:        String(id),
                name:        data?.assetInfo?.apparatusId || '',
                parentId:    String(parentId),
                _type:       'asset',
                asset:       'Current transformer',
                _serverData: data || {},
            },
            _type:       'asset',
            asset:       'Current transformer',
            parentBayId: String(parentId),
        }
    } catch (error) {
        console.error(`Error fetching currentTransformer with id ${id}:`, error)
        throw new Error(`Error fetching currentTransformer with id ${id}: ${error.message}`)
    }
}

export async function downloadCurrentTransformerChain(data, ctx) {
    const ct         = data.currentTransformer
    const serverData = { ...ct._serverData, mRID: ct.mrid }

    const serverDto       = CurrentTransformerServerMapper.mapServerToDto(serverData)
    serverDto.psrId       = data.parentBayId
    serverDto.properties.mrid = ct.mrid

    const existingResult = await window.electronAPI.getCurrentTransformerEntityByMrid(
        ct.mrid, data.parentBayId
    )
    const clientEntity = existingResult.success ? existingResult.data : null
    const clientDto    = clientEntity
        ? CurrentTransformerMapper.currentTransformerEntityToDto(clientEntity)
        : null

    let mergedDto

    if (!clientDto) {
        mergedDto = serverDto
    } else {
        const snapshotResult = await window.electronAPI.getEntitySnapshotByMrid(ct.mrid, 'currentTransformer')
        const baseDto        = snapshotResult.success ? snapshotResult.data : null

        if (!baseDto) {
            mergedDto = mergeWithoutSnapshot(clientDto, serverDto, CURRENT_TRANSFORMER_FIELD_DEFS)
        } else {
            const diffFields  = detectConflicts(baseDto, clientDto, serverDto, CURRENT_TRANSFORMER_FIELD_DEFS)
            const hasConflict = diffFields.some(f => f.status === 'conflict')

            if (!hasConflict) {
                mergedDto = applyResolved(diffFields, clientDto)
            } else {
                const resolved = await showConflictDialog({
                    title:  `Data Conflict — ${ct.name}`,
                    fields: diffFields,
                })
                mergedDto = applyResolved(resolved, clientDto)
            }
        }

        mergedDto.assetInfoId         = clientDto.assetInfoId         || serverDto.assetInfoId
        mergedDto.productAssetModelId = clientDto.productAssetModelId || serverDto.productAssetModelId
        mergedDto.lifecycleDateId     = clientDto.lifecycleDateId     || serverDto.lifecycleDateId
        mergedDto.assetPsrId          = clientDto.assetPsrId          || serverDto.assetPsrId
        mergedDto.locationId          = clientDto.locationId          || serverDto.locationId
    }

    mergedDto.properties.mrid = ct.mrid
    mergedDto.psrId           = data.parentBayId

    const oldEntity = clientEntity || new CurrentTransformerEntity()
    const newEntity = CurrentTransformerMapper.currentTransformerDtoToEntity(mergedDto)

    console.log('Inserting CurrentTransformer entity with new data:', newEntity)
    const insertResult = await window.electronAPI.insertCurrentTransformerEntity(oldEntity, newEntity, serverDto)
    if (!insertResult.success) throw new Error(`Database Insert CurrentTransformer Error: ${insertResult.message}`)
}
