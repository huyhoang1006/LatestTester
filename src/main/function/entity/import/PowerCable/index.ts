import uuid from '@/utils/uuid'

export const importPowerCable: any = async (
  dto: any,
  parentNode: any,
  { electronAPI, mappings }: any
) => {
  try {
    if (
      parentNode?.mode &&
      parentNode.mode !== 'substation' &&
      parentNode.mode !== 'bay' &&
      parentNode.mode !== 'powerCable'
    ) {
      return {
        success: false,
        message: 'Power cable can only be imported under a Substation, Bay or PowerCable'
      }
    }

    const entity = mappings.PowerCableMapping.mapDtoToEntity(dto)
    let oldEntity: any = null
    let shouldRegenerate = false

    if (dto.clone === true) {
      shouldRegenerate = true
    } else if (entity.asset?.mrid) {
      const originalLocationId = entity.asset.location || dto.locationId

      if (originalLocationId && originalLocationId !== parentNode?.mrid) {
        shouldRegenerate = true
      } else {
        try {
          const existing: any = await electronAPI.getPowerCableEntityByMrid(entity.asset.mrid)

          if (existing?.success && existing?.data?.asset?.location === parentNode?.mrid) {
            oldEntity = existing.data
          } else {
            shouldRegenerate = true
          }
        } catch (e: any) {
          console.warn('Check existing PowerCable failed, treating as new:', e)
          shouldRegenerate = true
        }
      }
    } else {
      shouldRegenerate = true
    }

    if (shouldRegenerate) {
      regenerateAllMrids(entity)
    }

    entity.asset.location = null

    if (!entity.assetPsr) {
      entity.assetPsr = {
        mrid: uuid.newUuid(),
        asset_id: entity.asset.mrid,
        psr_id: parentNode?.mrid || null
      }
    } else {
      entity.assetPsr.asset_id = entity.asset.mrid
      entity.assetPsr.psr_id = parentNode?.mrid || null

      if (shouldRegenerate && !entity.assetPsr.mrid) {
        entity.assetPsr.mrid = uuid.newUuid()
      }
    }

    const ensureArray = (key: string) => {
      if (!Array.isArray(entity[key])) entity[key] = []
    }
    const ensureObject = (key: string) => {
      if (!entity[key] || typeof entity[key] !== 'object') entity[key] = {}
    }

    ensureArray('area')
    ensureArray('currentFlow')
    ensureArray('second')
    ensureArray('frequency')
    ensureArray('length')
    ensureArray('voltage')
    ensureArray('temperature')

    ensureObject('lifecycleDate')
    ensureObject('productAssetModel')
    ensureObject('concentricNeutral')
    ensureObject('joint')
    ensureObject('sheathVoltageLimiter')
    ensureObject('terminal')
    ensureObject('oldCableInfo')

    const ensureMrid = (obj: any, parentInfoId: string | null = null) => {
      if (obj && !obj.mrid) {
        obj.mrid = uuid.newUuid()
        if (parentInfoId) {
          if (obj !== entity.concentricNeutral) {
            obj.cable_info_id = parentInfoId
          }
        }
      }
    }

    if (!entity.asset.asset_info) {
      const newInfoId = uuid.newUuid()
      entity.asset.asset_info = newInfoId
      if (entity.powerCable) entity.powerCable.mrid = newInfoId
    }

    if (!entity.concentricNeutral.mrid) {
      entity.concentricNeutral.mrid = entity.asset.asset_info || uuid.newUuid()
    }

    const cableInfoId = entity.concentricNeutral.mrid

    ensureMrid(entity.joint, cableInfoId)
    ensureMrid(entity.terminal, cableInfoId)
    ensureMrid(entity.sheathVoltageLimiter, cableInfoId)
    ensureMrid(entity.oldCableInfo, cableInfoId)
    ensureMrid(entity.lifecycleDate)
    ensureMrid(entity.productAssetModel)

    if (oldEntity) {
      if (!Array.isArray(oldEntity.area)) oldEntity.area = []
      if (!Array.isArray(oldEntity.currentFlow)) oldEntity.currentFlow = []
      if (!Array.isArray(oldEntity.second)) oldEntity.second = []
      if (!Array.isArray(oldEntity.frequency)) oldEntity.frequency = []
      if (!Array.isArray(oldEntity.length)) oldEntity.length = []
      if (!Array.isArray(oldEntity.voltage)) oldEntity.voltage = []
      if (!Array.isArray(oldEntity.temperature)) oldEntity.temperature = []
    } else {
      oldEntity = {
        area: [],
        currentFlow: [],
        second: [],
        frequency: [],
        length: [],
        voltage: [],
        temperature: []
      }
    }

    if (!entity.asset.attachment) {
      entity.asset.attachment = {
        id: null,
        path: '[]',
        name: null,
        type: 'asset',
        id_foreign: null
      }
    } else if (!entity.asset.attachment.path) {
      entity.asset.attachment.path = '[]'
    }

    const result: any = await electronAPI.insertPowerCableEntity(oldEntity, entity)
    return { ...result, entity }
  } catch (error: any) {
    console.error('Error importing power cable:', error)
    return { success: false, message: error.message }
  }
}

const regenerateAllMrids = (entity: any) => {
  const newAssetMrid = uuid.newUuid()

  entity.asset.mrid = newAssetMrid

  const newAssetInfoMrid = uuid.newUuid()
  if (entity.assetInfo) entity.assetInfo.mrid = newAssetInfoMrid
  entity.asset.asset_info = newAssetInfoMrid

  const newProductAssetModelMrid = uuid.newUuid()
  if (entity.productAssetModel) entity.productAssetModel.mrid = newProductAssetModelMrid
  entity.asset.product_asset_model = newProductAssetModelMrid

  const newLifecycleDateMrid = uuid.newUuid()
  if (entity.lifecycleDate) entity.lifecycleDate.mrid = newLifecycleDateMrid
  entity.asset.lifecycle_date = newLifecycleDateMrid

  if (entity.assetPsr) {
    entity.assetPsr.mrid = uuid.newUuid()
    entity.assetPsr.asset_id = newAssetMrid
    entity.assetPsr.psr_id = null
  } else {
    entity.assetPsr = {
      mrid: uuid.newUuid(),
      asset_id: newAssetMrid,
      psr_id: null
    }
  }

  if (entity.concentricNeutral) {
    entity.concentricNeutral.mrid = newAssetInfoMrid
  }

  if (entity.oldPowerCableInfo) {
    entity.oldPowerCableInfo.mrid = newAssetInfoMrid
  }

  if (entity.joint) {
    entity.joint.mrid = uuid.newUuid()
    entity.joint.cable_info_id = newAssetInfoMrid
  }
  if (entity.terminal) {
    entity.terminal.mrid = uuid.newUuid()
    entity.terminal.cable_info_id = newAssetInfoMrid
  }
  if (entity.sheathVoltageLimiter) {
    entity.sheathVoltageLimiter.mrid = uuid.newUuid()
    entity.sheathVoltageLimiter.cable_info_id = newAssetInfoMrid
  }
  if (entity.oldCableInfo) {
    entity.oldCableInfo.mrid = uuid.newUuid()
    entity.oldCableInfo.cable_info_id = newAssetInfoMrid
  }

  const mridMap: any = {}
  const regenerateUnit = (unit: any) => {
    if (unit && unit.mrid) {
      const oldMrid = unit.mrid
      const newMrid = uuid.newUuid()
      mridMap[oldMrid] = newMrid
      unit.mrid = newMrid
    }
  }

  if (entity.voltage) entity.voltage.forEach(regenerateUnit)
  if (entity.currentFlow) entity.currentFlow.forEach(regenerateUnit)
  if (entity.length) entity.length.forEach(regenerateUnit)
  if (entity.resistance) entity.resistance.forEach(regenerateUnit)
  if (entity.capacitance) entity.capacitance.forEach(regenerateUnit)
  if (entity.temperature) entity.temperature.forEach(regenerateUnit)
  if (entity.area) entity.area.forEach(regenerateUnit)
  if (entity.frequency) entity.frequency.forEach(regenerateUnit)
  if (entity.second) entity.second.forEach(regenerateUnit)

  if (entity.wireArrangement) {
    entity.wireArrangement.forEach((wire: any) => {
      wire.mrid = uuid.newUuid()
      wire.power_cable_info_id = newAssetInfoMrid
    })
  }

  if (entity.oldPowerCableInfo) {
    const info = entity.oldPowerCableInfo
    info.rated_voltage = mridMap[info.rated_voltage] || null
    info.nominal_voltage = mridMap[info.nominal_voltage] || null
    info.max_operating_voltage = mridMap[info.max_operating_voltage] || null
    info.max_current = mridMap[info.max_current] || null
    info.rated_current = mridMap[info.rated_current] || null
  }
}
