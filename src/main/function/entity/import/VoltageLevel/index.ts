import uuid from '@/utils/uuid'

export const importVoltageLevel = async (
  data: any,
  parentNode: any,
  { electronAPI, mappings }: { electronAPI: any; mappings: any }
) => {
  try {
    if (
      parentNode &&
      parentNode.mode &&
      parentNode.mode !== 'substation' &&
      parentNode.mode !== 'voltageLevel'
    ) {
      return {
        success: false,
        message: 'Voltage Level can only be imported under a Substation or Voltage Level'
      }
    }

    let entity = convertToEntity(data, mappings)

    const shouldCreateNew = await checkIfShouldCreateNew(entity, data, parentNode, electronAPI)
    if (shouldCreateNew) {
      regenerateAllIds(entity)
    }

    assignParentRelationship(entity, parentNode)

    ensureRequiredIds(entity, data)

    const result = await electronAPI.insertVoltageLevelEntity(entity)
    return { ...result, entity }
  } catch (error) {
    console.error('Error importing Voltage Level:', error)
    return { success: false, message: (error as Error).message }
  }
}

function convertToEntity(data: any, mappings: any) {
  if (data.voltageLevel && data.baseVoltage) {
    return JSON.parse(JSON.stringify(data))
  } else {
    return mappings.VoltageLevelMapping.volDtoToVolEntity(data)
  }
}

async function checkIfShouldCreateNew(entity: any, data: any, parentNode: any, electronAPI: any) {
  const originalLocationId =
    data.locationId || (entity.voltageLevel && entity.voltageLevel.location)
  const mrid = (entity.voltageLevel && entity.voltageLevel.mrid) || data.voltageLevelId

  if (!mrid) {
    return true
  }

  if (
    originalLocationId &&
    parentNode &&
    parentNode.mrid &&
    originalLocationId !== parentNode.mrid
  ) {
    return true
  }

  try {
    const existing = await electronAPI.getVoltageLevelEntityByMrid(mrid)
    if (existing.success && existing.data && existing.data.voltageLevel) {
      const existingLocation = existing.data.voltageLevel.location
      const targetLocation = parentNode && parentNode.mrid

      if (existingLocation === targetLocation) {
        return false
      } else {
        return true
      }
    }
  } catch (error) {
    // ignored
  }

  return true
}

function regenerateAllIds(obj: any) {
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

function assignParentRelationship(entity: any, parentNode: any) {
  if (!parentNode || !parentNode.mrid) return

  if (parentNode.mode === 'substation') {
    entity.voltageLevel.substation = parentNode.mrid
  }

  entity.voltageLevel.location = null
}

function ensureRequiredIds(entity: any, data: any) {
  const BaseVoltage = require('@/views/Cim/BaseVoltage').default
  const Voltage = require('@/views/Cim/Voltage').default

  if (!entity.voltageLevel.mrid) {
    entity.voltageLevel.mrid = uuid.newUuid()
  }

  if (!entity.voltage) {
    entity.voltage = []
  }

  if (!entity.baseVoltage) {
    entity.baseVoltage = new BaseVoltage()
  }
  if (!entity.baseVoltage.mrid) {
    entity.baseVoltage.mrid = uuid.newUuid()
  }

  entity.voltageLevel.base_voltage = entity.baseVoltage.mrid

  const hasNominalVoltage = entity.voltage.some(
    (v: any) => v.mrid === entity.baseVoltage.nominal_voltage
  )

  if (!entity.baseVoltage.nominal_voltage || !hasNominalVoltage) {
    const nominalVoltageId = entity.baseVoltage.nominal_voltage || uuid.newUuid()
    entity.baseVoltage.nominal_voltage = nominalVoltageId

    if (!hasNominalVoltage) {
      const nominalVoltage = new Voltage()
      nominalVoltage.mrid = nominalVoltageId
      nominalVoltage.value = data.base_voltage_value || null
      nominalVoltage.unit = data.base_voltage_unit || null
      nominalVoltage.multiplier = data.base_voltage_multiplier || null
      entity.voltage.push(nominalVoltage)
    }
  }

  entity.voltage.forEach((v: any) => {
    if (!v.mrid) {
      v.mrid = uuid.newUuid()
    }
  })
}
