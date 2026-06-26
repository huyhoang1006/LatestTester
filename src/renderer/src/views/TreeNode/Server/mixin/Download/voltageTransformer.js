/* eslint-disable */
import { getVoltageTransformerById } from '@/api/demo/index.js'
import * as VoltageTransformerServerMapper from '@/views/Mapping/ServerToDTO/VoltageTransformer/index.js'
import * as VoltageTransformerMapper from '@/views/Mapping/VoltageTransformer/index.js'
import VoltageTransformerEntity from '@/views/Flatten/VoltageTransformer/index.js'
import { fetchWithRetry } from './core-utils.js'
import { detectConflicts, applyResolved, mergeWithoutSnapshot, VOLTAGE_TRANSFORMER_FIELD_DEFS } from '@/utils/conflictUtils.js'
import { showConflictDialog } from '@/store/conflictDialog'

export async function getVoltageTransformerChain(id, parentId) {
    try {
        const data = await fetchWithRetry(() => getVoltageTransformerById(id))
        return {
            voltageTransformer: {
                id:          id,
                mrid:        String(id),
                name:        data?.assetInfoResponseDTO?.apparatusId || '',
                parentId:    String(parentId),
                _type:       'asset',
                asset:       'Voltage transformer',
                _serverData: data || {},
            },
            _type:       'asset',
            asset:       'Voltage transformer',
            parentBayId: String(parentId),
        }
    } catch (error) {
        console.error(`Error fetching voltageTransformer with id ${id}:`, error)
        throw new Error(`Error fetching voltageTransformer with id ${id}: ${error.message}`)
    }
}

export async function downloadVoltageTransformerChain(data, ctx) {
    const vt         = data.voltageTransformer
    const serverData = { ...vt._serverData, mRID: vt.mrid }

    const serverDto       = VoltageTransformerServerMapper.mapServerToDto(serverData)
    serverDto.psrId       = data.parentBayId
    serverDto.properties.mrid = vt.mrid

    const existingResult = await window.electronAPI.getVoltageTransformerEntityByMrid(
        vt.mrid, data.parentBayId
    )
    const clientEntity = existingResult.success ? existingResult.data : null
    const clientDto    = clientEntity
        ? VoltageTransformerMapper.voltageTransformerEntityToDto(clientEntity)
        : null

    let mergedDto

    if (!clientDto) {
        mergedDto = serverDto
    } else {
        const snapshotResult = await window.electronAPI.getEntitySnapshotByMrid(vt.mrid, 'voltageTransformer')
        const baseDto        = snapshotResult.success ? snapshotResult.data : null

        if (!baseDto) {
            mergedDto = mergeWithoutSnapshot(clientDto, serverDto, VOLTAGE_TRANSFORMER_FIELD_DEFS)
        } else {
            const diffFields  = detectConflicts(baseDto, clientDto, serverDto, VOLTAGE_TRANSFORMER_FIELD_DEFS)
            const hasConflict = diffFields.some(f => f.status === 'conflict')

            if (!hasConflict) {
                mergedDto = applyResolved(diffFields, clientDto)
            } else {
                const resolved = await showConflictDialog({
                    title:  `Data Conflict — ${vt.name}`,
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

    mergedDto.mrid            = vt.mrid
    mergedDto.psrId           = data.parentBayId
    mergedDto.properties.mrid = vt.mrid

    const oldEntity = clientEntity || new VoltageTransformerEntity()
    const newEntity = VoltageTransformerMapper.voltageTransformerDtoToEntity(mergedDto)

    const insertResult = await window.electronAPI.insertVoltageTransformerEntity(oldEntity, newEntity, serverDto)
    if (!insertResult.success) throw new Error(`Database Insert VoltageTransformer Error: ${insertResult.message}`)
}
