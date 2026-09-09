import uuid from '@/utils/uuid'

export const importCurrentTransformer: any = async (
  dto: any,
  parentNode: any,
  { electronAPI, mappings }: any
) => {
  try {
    if (
      parentNode?.mode &&
      parentNode.mode !== 'substation' &&
      parentNode.mode !== 'bay' &&
      parentNode.mode !== 'currentTransformer'
    ) {
      return {
        success: false,
        message:
          'Current transformer can only be imported under a Substation, Bay or CurrentTransformer'
      }
    }

    const entity = mappings.CurrentTransformerMapping.mapDtoToEntity(dto)
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
          const existing: any = await electronAPI.getCurrentTransformerEntityByMrid(
            entity.asset.mrid,
            parentNode?.mrid
          )

          if (existing?.success && existing?.data?.asset?.location === parentNode?.mrid) {
            oldEntity = existing.data
          } else {
            shouldRegenerate = true
          }
        } catch (e: any) {
          console.warn('Check existing CurrentTransformer failed, treating as new:', e)
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

    const result: any = await electronAPI.insertCurrentTransformerEntity(oldEntity || {}, entity)

    return { ...result, entity }
  } catch (error: any) {
    console.error('Error importing current transformer:', error)
    return { success: false, message: error.message }
  }
}

const regenerateAllMrids = (entity: any) => {
  const newAssetMrid = uuid.newUuid()
  const newAssetInfoMrid = uuid.newUuid()
  const newProductAssetModelMrid = uuid.newUuid()
  const newLifecycleDateMrid = uuid.newUuid()
  const newAssetPsrMrid = uuid.newUuid()

  entity.asset.mrid = newAssetMrid
  entity.asset.asset_info = newAssetInfoMrid
  entity.asset.product_asset_model = newProductAssetModelMrid
  entity.asset.lifecycle_date = newLifecycleDateMrid
  entity.asset.location = null

  if (entity.assetInfo) {
    entity.assetInfo.mrid = newAssetInfoMrid
    entity.assetInfo.product_asset_model = newProductAssetModelMrid
  }

  if (entity.oldCurrentTransformerInfo) {
    entity.oldCurrentTransformerInfo.mrid = newAssetInfoMrid
  }

  if (entity.productAssetModel) {
    entity.productAssetModel.mrid = newProductAssetModelMrid
  }

  if (entity.lifecycleDate) {
    entity.lifecycleDate.mrid = newLifecycleDateMrid
  }

  if (entity.assetPsr) {
    entity.assetPsr.mrid = newAssetPsrMrid
    entity.assetPsr.asset_id = newAssetMrid
    entity.assetPsr.psr_id = null
  } else {
    entity.assetPsr = {
      mrid: newAssetPsrMrid,
      asset_id: newAssetMrid,
      psr_id: null
    }
  }

  if (entity.attachment?.mrid) {
    entity.attachment.mrid = uuid.newUuid()
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

  if (entity.voltage) {
    entity.voltage.forEach(regenerateUnit)
  }

  if (entity.currentFlow) {
    entity.currentFlow.forEach(regenerateUnit)
  }

  if (entity.seconds) {
    entity.seconds.forEach(regenerateUnit)
  }

  if (entity.frequency) {
    entity.frequency.forEach(regenerateUnit)
  }

  if (entity.resistance) {
    entity.resistance.forEach(regenerateUnit)
  }

  if (entity.percent) {
    entity.percent.forEach(regenerateUnit)
  }

  if (entity.apparentPower) {
    entity.apparentPower.forEach(regenerateUnit)
  }

  if (entity.temperature) {
    entity.temperature.forEach(regenerateUnit)
  }

  if (entity.oldCurrentTransformerInfo) {
    const info = entity.oldCurrentTransformerInfo
    info.rated_frequency = mridMap[info.rated_frequency] || null
    info.um_rms = mridMap[info.um_rms] || null
    info.u_withstand_rms = mridMap[info.u_withstand_rms] || null
    info.u_lightning_peak = mridMap[info.u_lightning_peak] || null
    info.i_cth = mridMap[info.i_cth] || null
    info.i_dynamic_peak = mridMap[info.i_dynamic_peak] || null
    info.ith_rms = mridMap[info.ith_rms] || null
    info.ith_duration = mridMap[info.ith_duration] || null
    info.system_voltage = mridMap[info.system_voltage] || null
    info.bil = mridMap[info.bil] || null
    info.rating_factor_temp = mridMap[info.rating_factor_temp] || null
  }

  if (entity.CtCoreInfo) {
    entity.CtCoreInfo.forEach((core: any) => {
      const oldCoreMrid = core.mrid
      const newCoreMrid = uuid.newUuid()
      mridMap[oldCoreMrid] = newCoreMrid

      core.mrid = newCoreMrid
      core.current_transformer_info_id = newAssetInfoMrid
      core.winding_resistance = mridMap[core.winding_resistance] || null
      core.vb = mridMap[core.vb] || null
      core.ratio_error = mridMap[core.ratio_error] || null

      if (entity.CtTapInfo) {
        entity.CtTapInfo.forEach((tap: any) => {
          if (tap.ct_core_info_id === oldCoreMrid) {
            tap.ct_core_info_id = newCoreMrid
          }
        })
      }
    })
  }

  if (entity.CtTapInfo) {
    entity.CtTapInfo.forEach((tap: any) => {
      tap.mrid = uuid.newUuid()
      tap.ipn = mridMap[tap.ipn] || null
      tap.isn = mridMap[tap.isn] || null
      tap.rated_burden = mridMap[tap.rated_burden] || null
      tap.burden = mridMap[tap.burden] || null
      tap.operating_burden = mridMap[tap.operating_burden] || null
    })
  }
}
