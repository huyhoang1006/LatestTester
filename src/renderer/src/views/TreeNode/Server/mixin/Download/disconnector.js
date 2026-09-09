/* eslint-disable */
import { getDisconnectorById } from '@/api/demo/index.js'
import * as DisconnectorServerMapper from '@/views/Mapping/ServerToDTO/Disconnector/index.js'
import * as DisconnectorMapper from '@/views/Mapping/Disconnector/index.js'
import { fetchWithRetry } from './core-utils.js'
import {
  detectConflicts,
  applyResolved,
  mergeWithoutSnapshot,
  DISCONNECTOR_FIELD_DEFS
} from '@/utils/conflictUtils.js'
import { showConflictDialog } from '@/store/conflictDialog'

export async function getDisconnectorChain(id, parentId) {
  try {
    const data = await fetchWithRetry(() => getDisconnectorById(id))
    return {
      disconnector: {
        id: id,
        mrid: String(id),
        name: data?.assetInfo?.apparatusId || '',
        parentId: String(parentId),
        _type: 'asset',
        asset: 'Disconnector',
        _serverData: data || {}
      },
      _type: 'asset',
      asset: 'Disconnector',
      parentBayId: String(parentId)
    }
  } catch (error) {
    console.error(`Error fetching disconnector with id ${id}:`, error)
    throw new Error(`Error fetching disconnector with id ${id}: ${error.message}`)
  }
}

export async function downloadDisconnectorChain(data, ctx) {
  const dc = data.disconnector
  const serverData = { ...dc._serverData, mRID: dc.mrid }

  const serverDto = DisconnectorServerMapper.mapServerToDto(serverData)
  serverDto.psrId = data.parentBayId
  serverDto.properties.mrid = dc.mrid

  const existingResult = await window.electronAPI.getDisconnectorEntityByMrid(
    dc.mrid,
    data.parentBayId
  )
  const clientEntity = existingResult.success ? existingResult.data : null
  const clientDto = clientEntity ? DisconnectorMapper.disconnectorEntityToDto(clientEntity) : null

  let mergedDto

  if (!clientDto) {
    mergedDto = serverDto
  } else {
    const snapshotResult = await window.electronAPI.getEntitySnapshotByMrid(dc.mrid, 'disconnector')
    const baseDto = snapshotResult.success ? snapshotResult.data : null

    if (!baseDto) {
      mergedDto = mergeWithoutSnapshot(clientDto, serverDto, DISCONNECTOR_FIELD_DEFS)
    } else {
      const diffFields = detectConflicts(baseDto, clientDto, serverDto, DISCONNECTOR_FIELD_DEFS)
      const hasConflict = diffFields.some((f) => f.status === 'conflict')

      if (!hasConflict) {
        mergedDto = applyResolved(diffFields, clientDto)
      } else {
        const resolved = await showConflictDialog({
          title: `Data Conflict — ${dc.name}`,
          fields: diffFields
        })
        mergedDto = applyResolved(resolved, clientDto)
      }
    }

    mergedDto.assetInfoId = clientDto.assetInfoId || serverDto.assetInfoId
    mergedDto.productAssetModelId = clientDto.productAssetModelId || serverDto.productAssetModelId
    mergedDto.lifecycleDateId = clientDto.lifecycleDateId || serverDto.lifecycleDateId
    mergedDto.assetPsrId = clientDto.assetPsrId || serverDto.assetPsrId
    mergedDto.locationId = clientDto.locationId || serverDto.locationId
  }

  mergedDto.mrid = dc.mrid
  mergedDto.psrId = data.parentBayId
  mergedDto.properties.mrid = dc.mrid

  const entity = DisconnectorMapper.disconnectorDtoToEntity(mergedDto)

  const insertResult = await fetchWithRetry(() =>
    window.electronAPI.insertDisconnectorEntity(entity, serverDto)
  )
  if (!insertResult.success)
    throw new Error(`Database Insert Disconnector Error: ${insertResult.message}`)
}
