import uuid from '@/utils/uuid'

export const importBreaker: any = async (
  dto: any,
  parentNode: any,
  { electronAPI, mappings }: any
) => {
  try {
    if (!parentNode?.mode || !['substation', 'bay', 'breaker'].includes(parentNode.mode)) {
      return {
        success: false,
        message: 'Breaker can only be imported under Substation, Bay or Breaker'
      }
    }

    if (parentNode?.mrid) {
      let parentData: any = null
      try {
        if (parentNode.mode === 'substation') {
          const res: any = await electronAPI.getSubstationEntityByMrid(parentNode.mrid)
          if (res?.success) parentData = res.data
        } else if (parentNode.mode === 'bay') {
          const res: any = await electronAPI.getBayEntityByMrid(parentNode.mrid)
          if (res?.success) parentData = res.data
        } else if (parentNode.mode === 'breaker') {
          const res: any = await electronAPI.getBreakerEntityByMrid(parentNode.mrid)
          if (res?.success) parentData = res.data
        }

        if (!parentData) {
          console.error(
            `Parent node ${parentNode.mode} with ID ${parentNode.mrid} not found in DB.`
          )
          return {
            success: false,
            message: `Cannot import: Parent ${parentNode.mode} does not exist in Database. Please refresh.`
          }
        }
      } catch (err: any) {
        console.warn(`Could not verify parent existence: ${err.message}`)
      }
    }

    if (!mappings?.BreakerMapping?.mapDtoToEntity) {
      return {
        success: false,
        message: 'BreakerMapping not found or mapDtoToEntity not defined'
      }
    }

    const entity = mappings.BreakerMapping.mapDtoToEntity(dto)

    if (!entity || !entity.asset) {
      console.error('Failed to map Breaker DTO:', dto)
      return {
        success: false,
        message: 'Failed to map DTO to entity - result is invalid'
      }
    }

    let oldEntity: any = null

    const regenerateAllIds = (obj: any) => {
      if (!obj || typeof obj !== 'object') return

      Object.keys(obj).forEach((key) => {
        const value = obj[key]
        if (key === 'mrid' || key === 'id') {
          obj[key] = uuid.newUuid()
        } else if (Array.isArray(value)) {
          value.forEach((v) => regenerateAllIds(v))
        } else if (typeof value === 'object' && value !== null) {
          regenerateAllIds(value)
        }
      })
    }

    if (dto.clone === true) {
      regenerateAllIds(entity)
    } else if (entity.asset.mrid) {
      const originalLocationId = entity.asset.location || dto.locationId

      if (originalLocationId && originalLocationId !== parentNode?.mrid) {
        regenerateAllIds(entity)
      } else {
        try {
          const existing: any = await electronAPI.getBreakerEntityByMrid(
            entity.asset.mrid,
            parentNode?.mrid
          )

          if (existing?.success && existing?.data?.asset?.location === parentNode?.mrid) {
            oldEntity = existing.data
          } else {
            regenerateAllIds(entity)
          }
        } catch {
          regenerateAllIds(entity)
        }
      }
    }

    if (parentNode?.mrid) {
      entity.asset.location = parentNode.mrid
    }

    if (!entity.asset.mrid) {
      entity.asset.mrid = uuid.newUuid()
    }

    entity.assetPsr = entity.assetPsr || {}

    if (!entity.assetPsr.mrid || dto.clone || !oldEntity) {
      entity.assetPsr.mrid = uuid.newUuid()
    }

    entity.assetPsr.asset_id = entity.asset.mrid
    entity.assetPsr.psr_id = parentNode?.mrid || null

    if (!entity.assetPsr.psr_id) {
      console.warn('Warning: Importing Breaker without a valid Parent PSR ID (psr_id is null)')
    }

    const buildSafeEntity = (targetObj: any = {}) => {
      const obj = targetObj || {}

      const unitTypes = [
        'resistance',
        'capacitance',
        'voltage',
        'currentFlow',
        'second',
        'activePower',
        'length',
        'mass',
        'volume',
        'temperature',
        'frequency',
        'quantity',
        'pressure'
      ]

      const tableTypes = [
        'operatingMechanismComponent',
        'contactResistanceBreakerInfo',
        'operatingTimeBreakerInfo',
        'contactTravelBreakerInfo',
        'tripOperation',
        'closeOperation',
        'miscellaneousBreakerInfo',
        'coilCharacteristicsBreakerInfo',
        'pickupVoltageBreakerInfo',
        'motorCharacteristicsBreakerInfo',
        'underVoltageReleaseBreakerInfo',
        'overcurrentReleaseBreakerInfo'
      ]

      const otherArrays = [
        'insulationResistance',
        'contactResistance',
        'dynamicResistance',
        'timingTest',
        'travelCurve',
        'motorTest',
        'coilTest',
        'vacuumTest',
        'sf6Test',
        'undervoltageTest'
      ]

      const allArrays = [...unitTypes, ...tableTypes, ...otherArrays]

      allArrays.forEach((k) => {
        if (!Array.isArray(obj[k])) {
          obj[k] = []
        }
      })

      obj.asset = obj.asset || {}
      obj.asset.attachment = obj.asset.attachment || {
        id: null,
        path: '[]',
        name: null,
        type: 'asset',
        id_foreign: null
      }

      obj.breakerInfo = obj.breakerInfo || {}
      obj.nameplate = obj.nameplate || {}
      obj.assetPsr = obj.assetPsr || {}

      obj.lifecycleDate = obj.lifecycleDate || {}
      obj.operatingLifecycleDate = obj.operatingLifecycleDate || {}
      obj.productAssetModel = obj.productAssetModel || {}
      obj.operatingProductAssetModel = obj.operatingProductAssetModel || {}
      obj.oldBreakerInfo = obj.oldBreakerInfo || {}
      obj.breakerRatingInfo = obj.breakerRatingInfo || {}
      obj.breakerContactSystemInfo = obj.breakerContactSystemInfo || {}
      obj.breakerOtherInfo = obj.breakerOtherInfo || {}
      obj.oldOperatingMechanism = obj.oldOperatingMechanism || {}
      obj.oldOperatingMechanismInfo = obj.oldOperatingMechanismInfo || {}
      obj.assessmentLimitBreakerInfo = obj.assessmentLimitBreakerInfo || {}
      obj.auxiliaryContactsBreakerInfo = obj.auxiliaryContactsBreakerInfo || {}

      return obj
    }

    if (!oldEntity) {
      oldEntity = buildSafeEntity({})
    } else {
      buildSafeEntity(oldEntity)
    }

    buildSafeEntity(entity)

    const normalizeAssetAttachment = (obj: any) => {
      if (!obj.asset) obj.asset = {}
      if (!obj.asset.attachment) {
        obj.asset.attachment = {
          id: null,
          path: '[]',
          name: null,
          type: 'asset',
          id_foreign: null
        }
      } else if (!obj.asset.attachment.path) {
        obj.asset.attachment.path = '[]'
      }
    }

    normalizeAssetAttachment(oldEntity)
    normalizeAssetAttachment(entity)

    const result: any = await electronAPI.insertBreakerEntity(oldEntity, entity)

    return { ...result, entity }
  } catch (error: any) {
    console.error('Error importing breaker:', error)
    return { success: false, message: error.message }
  }
}
