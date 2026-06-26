import uuid from '@/utils/uuid'

export const importVoltageTransformer: any = async (dto: any, parentNode: any, { electronAPI, mappings }: any) => {
    try {
        if (
            parentNode?.mode &&
            parentNode.mode !== 'substation' &&
            parentNode.mode !== 'bay' &&
            parentNode.mode !== 'voltageTransformer'
        ) {
            return {
                success: false,
                message: 'Voltage transformer can only be imported under a Substation, Bay or Voltage Transformer'
            }
        }

        dto.properties = dto.properties || {}
        dto.ratings = dto.ratings || {}
        dto.ratings.rated_frequency = dto.ratings.rated_frequency || {}
        dto.ratings.rated_voltage = dto.ratings.rated_voltage || {}
        dto.ratings.standard = typeof dto.ratings.standard === 'object' ? JSON.stringify(dto.ratings.standard) : (dto.ratings.standard || '')
        dto.ratings.upr = dto.ratings.upr || ''
        dto.vt_Configuration = dto.vt_Configuration || {}
        dto.vt_Configuration.windings = dto.vt_Configuration.windings || ''
        dto.vt_Configuration.dataVT = dto.vt_Configuration.dataVT || []
        dto.attachment = dto.attachment || { path: '[]' }

        const entity = mappings.VoltageTransformerMapping.mapDtoToEntity(dto)
        let oldEntity: any = null
        let shouldRegenerate = false

        if (dto.clone === true) {
            shouldRegenerate = true
        }
        else if (entity.asset?.mrid) {
            const originalLocationId = entity.asset.location || dto.locationId

            if (originalLocationId && originalLocationId !== parentNode?.mrid) {
                shouldRegenerate = true
            } else {
                try {
                    const existing: any = await electronAPI.getVoltageTransformerEntityByMrid(
                        entity.asset.mrid,
                        parentNode?.mrid
                    )

                    if (
                        existing?.success &&
                        existing?.data?.asset?.location === parentNode?.mrid
                    ) {
                        oldEntity = existing.data
                    } else {
                        shouldRegenerate = true
                    }
                } catch (e: any) {
                    console.warn('Check existing VoltageTransformer failed, treating as new:', e)
                    shouldRegenerate = true
                }
            }
        }
        else {
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

        const result: any = await electronAPI.insertVoltageTransformerEntity(oldEntity || {}, entity)
        return { ...result, entity }

    } catch (error: any) {
        console.error('Error importing voltage transformer:', error)
        return { success: false, message: error.message }
    }
}

const regenerateAllMrids = (entity: any) => {
    const newAssetMrid = uuid.newUuid()
    const newAssetInfoMrid = uuid.newUuid()
    const newProductAssetModelMrid = uuid.newUuid()
    const newLifecycleDateMrid = uuid.newUuid()

    entity.asset.mrid = newAssetMrid
    entity.asset.asset_info = newAssetInfoMrid
    entity.asset.product_asset_model = newProductAssetModelMrid
    entity.asset.lifecycle_date = newLifecycleDateMrid
    entity.asset.location = null

    if (entity.assetInfo) {
        entity.assetInfo.mrid = newAssetInfoMrid
        entity.assetInfo.product_asset_model = newProductAssetModelMrid
    }

    if (entity.OldPotentialTransformerInfo) {
        entity.OldPotentialTransformerInfo.mrid = newAssetInfoMrid
        entity.OldPotentialTransformerInfo.product_asset_model = newProductAssetModelMrid
    }
    if (entity.oldPotentialTransformerInfo) {
        entity.oldPotentialTransformerInfo.mrid = newAssetInfoMrid
        entity.oldPotentialTransformerInfo.product_asset_model = newProductAssetModelMrid
    }

    if (entity.productAssetModel) {
        entity.productAssetModel.mrid = newProductAssetModelMrid
    }

    if (entity.lifecycleDate) {
        entity.lifecycleDate.mrid = newLifecycleDateMrid
    }

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

    if (entity.voltage) entity.voltage.forEach(regenerateUnit)
    if (entity.currentFlow) entity.currentFlow.forEach(regenerateUnit)
    if (entity.seconds) entity.seconds.forEach(regenerateUnit)
    if (entity.frequency) entity.frequency.forEach(regenerateUnit)
    if (entity.resistance) entity.resistance.forEach(regenerateUnit)
    if (entity.percent) entity.percent.forEach(regenerateUnit)
    if (entity.apparentPower) entity.apparentPower.forEach(regenerateUnit)
    if (entity.temperature) entity.temperature.forEach(regenerateUnit)
    if (entity.ratio) entity.ratio.forEach(regenerateUnit)
    if (entity.angle) entity.angle.forEach(regenerateUnit)
    if (entity.capacitance) entity.capacitance.forEach(regenerateUnit)

    const updateInfoRefs = (info: any) => {
        if (!info) return
        info.rated_frequency = mridMap[info.rated_frequency] || null
        info.rated_voltage = mridMap[info.rated_voltage] || null

        info.um_rms = mridMap[info.um_rms] || null
        info.rated_power_frequency_withstand_voltage = mridMap[info.rated_power_frequency_withstand_voltage] || null
        info.rated_lightning_impulse_withstand_voltage = mridMap[info.rated_lightning_impulse_withstand_voltage] || null
        info.system_voltage = mridMap[info.system_voltage] || null
        info.bil = mridMap[info.bil] || null
    }

    if (entity.OldPotentialTransformerInfo) updateInfoRefs(entity.OldPotentialTransformerInfo)
    if (entity.oldPotentialTransformerInfo) updateInfoRefs(entity.oldPotentialTransformerInfo)

    if (entity.potentialTransformerTable) {
        entity.potentialTransformerTable.forEach((item: any) => {
            const oldItemMrid = item.mrid
            const newItemMrid = uuid.newUuid()
            mridMap[oldItemMrid] = newItemMrid

            item.mrid = newItemMrid
            item.potential_transformer_info_id = newAssetInfoMrid

            item.usr_rated_voltage = mridMap[item.usr_rated_voltage] || null
            item.rated_burden = mridMap[item.rated_burden] || null
        })
    }
}