import uuid from '@/utils/uuid'

export const importSubstation = async (
  dto: Record<string, unknown>,
  parentNode: any,
  { electronAPI, mappings }: { electronAPI: any; mappings: any }
) => {
  try {
    if (
      parentNode?.mode &&
      parentNode.mode !== 'organisation' &&
      parentNode.mode !== 'substation'
    ) {
      return {
        success: false,
        message: 'Substation can only be imported under Organisation or Substation'
      }
    }

    const entity = mappings.SubstationMapping.mapDtoToEntity(dto) || {}

    entity.substation ??= {}
    entity.organisationPsr ??= {}
    entity.userIdentifiedObject ??= {}
    entity.personSubstation ??= {}

    const newSubstationMrid = uuid.newUuid()

    entity.substation.mrid = newSubstationMrid
    entity.substation.psr_type_id = entity?.psrType?.mrid || null

    entity.organisationPsr.mrid = uuid.newUuid()
    entity.organisationPsr.psr_id = newSubstationMrid

    if (parentNode?.mode === 'organisation' && parentNode?.mrid) {
      entity.organisationPsr.organisation_id = parentNode.mrid
    } else if (parentNode?.mode === 'substation' && parentNode?.organisation_id) {
      entity.organisationPsr.organisation_id = parentNode.organisation_id
    } else if (parentNode?.mrid) {
      entity.organisationPsr.organisation_id = parentNode.organisation_id || null
    } else {
      entity.organisationPsr.organisation_id = null
    }

    entity.userIdentifiedObject.mrid = uuid.newUuid()
    entity.userIdentifiedObject.identified_object_id = newSubstationMrid

    if (entity.personSubstation) {
      entity.personSubstation.mrid = uuid.newUuid()
      entity.personSubstation.substation_id = newSubstationMrid
    }

    if (entity.location) entity.location.mrid = uuid.newUuid()
    if (entity.streetAddress) entity.streetAddress.mrid = uuid.newUuid()
    if (entity.streetDetail) entity.streetDetail.mrid = uuid.newUuid()
    if (entity.townDetail) entity.townDetail.mrid = uuid.newUuid()

    if (Array.isArray(entity.positionPoint)) {
      entity.positionPoint.forEach((p: any) => (p.mrid = uuid.newUuid()))
    }

    if (Array.isArray(entity.attachment)) {
      entity.attachment.forEach((a: any) => (a.mrid = uuid.newUuid()))
    }

    if (Array.isArray(entity.configurationEvent)) {
      entity.configurationEvent.forEach((e: any) => (e.mrid = uuid.newUuid()))
    }

    const result = await electronAPI.insertSubstationEntity(entity)
    return {
      ...result,
      entity
    }
  } catch (error) {
    console.error('Error importing substation:', error)
    return {
      success: false,
      message: (error as any)?.message || 'Import Substation failed'
    }
  }
}
