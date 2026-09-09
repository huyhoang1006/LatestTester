/* eslint-disable */
import { getCircuitBreakerById } from '@/api/demo/index.js'
import * as CircuitBreakerServerMapper from '@/views/Mapping/ServerToDTO/CircuitBreaker/index.js'
import * as CircuitBreakerMapper from '@/views/Mapping/Breaker/index.js'
import CircuitBreakerEntity from '@/views/Flatten/CircuitBreaker/index.js'
import { fetchWithRetry } from './core-utils.js'
import {
  detectConflicts,
  applyResolved,
  mergeWithoutSnapshot,
  CIRCUIT_BREAKER_FIELD_DEFS
} from '@/utils/conflictUtils.js'
import { showConflictDialog } from '@/store/conflictDialog'

// ─── Step 1: fetch full info từ server ───────────────────────────────────────

export async function getCircuitBreakerChain(id, parentId) {
  try {
    const data = await fetchWithRetry(() => getCircuitBreakerById(id))
    return {
      circuitBreaker: {
        id: id,
        mrid: String(id),
        name: data?.serialNumber || data?.lotNumber || '',
        parentId: String(parentId),
        _type: 'asset',
        asset: 'Circuit breaker',
        _serverData: data || {}
      },
      _type: 'asset',
      asset: 'Circuit breaker',
      parentBayId: String(parentId)
    }
  } catch (error) {
    console.error(`Error fetching circuitBreaker with id ${id}:`, error)
    throw new Error(`Error fetching circuitBreaker with id ${id}: ${error.message}`)
  }
}

// ─── Step 2: save to DB ───────────────────────────────────────────────────────

export async function downloadCircuitBreakerChain(data, ctx) {
  const cb = data.circuitBreaker
  const serverData = { ...cb._serverData, mRID: cb.mrid }

  const serverDto = CircuitBreakerServerMapper.mapServerToDto(serverData)
  serverDto.psrId = data.parentBayId
  serverDto.properties.mrid = cb.mrid

  const existingResult = await window.electronAPI.getBreakerEntityByMrid(cb.mrid, data.parentBayId)
  const clientEntity = existingResult.success ? existingResult.data : null
  const clientDto = clientEntity ? CircuitBreakerMapper.breakerEntityToDto(clientEntity) : null

  let mergedDto

  if (!clientDto) {
    mergedDto = serverDto
  } else {
    const snapshotResult = await window.electronAPI.getEntitySnapshotByMrid(
      cb.mrid,
      'circuitBreaker'
    )
    const baseDto = snapshotResult.success ? snapshotResult.data : null

    if (!baseDto) {
      mergedDto = mergeWithoutSnapshot(clientDto, serverDto, CIRCUIT_BREAKER_FIELD_DEFS)
    } else {
      const diffFields = detectConflicts(baseDto, clientDto, serverDto, CIRCUIT_BREAKER_FIELD_DEFS)
      const hasConflict = diffFields.some((f) => f.status === 'conflict')

      if (!hasConflict) {
        mergedDto = applyResolved(diffFields, clientDto)
      } else {
        const resolved = await showConflictDialog({
          title: `Data Conflict — ${cb.name}`,
          fields: diffFields
        })
        mergedDto = applyResolved(resolved, clientDto)
      }
    }

    mergedDto.assetInfoId = clientDto.assetInfoId || serverDto.assetInfoId
    mergedDto.productAssetModelId = clientDto.productAssetModelId || serverDto.productAssetModelId
    mergedDto.lifecycleDateId = clientDto.lifecycleDateId || serverDto.lifecycleDateId
    mergedDto.assetPsrId = clientDto.assetPsrId || serverDto.assetPsrId
    mergedDto.breakerRatingInfoId = clientDto.breakerRatingInfoId || serverDto.breakerRatingInfoId
    mergedDto.breakerContactSystemInfoId =
      clientDto.breakerContactSystemInfoId || serverDto.breakerContactSystemInfoId
    mergedDto.breakerOtherInfoId = clientDto.breakerOtherInfoId || serverDto.breakerOtherInfoId
    mergedDto.operatingMechanismId =
      clientDto.operatingMechanismId || serverDto.operatingMechanismId
    mergedDto.operatingMechanismInfoId =
      clientDto.operatingMechanismInfoId || serverDto.operatingMechanismInfoId
    mergedDto.operatingMechanismLifecycleDateId =
      clientDto.operatingMechanismLifecycleDateId || serverDto.operatingMechanismLifecycleDateId
    mergedDto.operatingMechanismProductAssetModelId =
      clientDto.operatingMechanismProductAssetModelId ||
      serverDto.operatingMechanismProductAssetModelId
    mergedDto.assessmentLimitBreakerInfoId =
      clientDto.assessmentLimitBreakerInfoId || serverDto.assessmentLimitBreakerInfoId
    mergedDto.locationId = clientDto.locationId || serverDto.locationId
  }

  mergedDto.properties.mrid = cb.mrid
  mergedDto.psrId = data.parentBayId

  traverseAndFillMrid(mergedDto)

  const oldEntity = clientEntity || new CircuitBreakerEntity()
  const newEntity = CircuitBreakerMapper.breakerDtoToEntity(mergedDto)

  const insertResult = await fetchWithRetry(() =>
    window.electronAPI.insertBreakerEntity(oldEntity, newEntity, serverDto)
  )
  if (!insertResult.success)
    throw new Error(`Database Insert CircuitBreaker Error: ${insertResult.message}`)
}

import uuid from '@/utils/uuid'

const traverseAndFillMrid = (obj) => {
  if (Array.isArray(obj)) {
    obj.forEach((item) => traverseAndFillMrid(item))
  } else if (obj !== null && typeof obj === 'object') {
    if ('mrid' in obj && (!obj.mrid || obj.mrid === '')) {
      obj.mrid = uuid.newUuid()
    }
    Object.values(obj).forEach((val) => traverseAndFillMrid(val))
  }
}
