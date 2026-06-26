import db from "@/function/datacontext/index";
import { backupAllFilesInDir, syncFilesWithDeletion, restoreFiles, deleteBackupFiles } from "@/function/entity/attachment";
import { insertProductAssetModelTransaction, getProductAssetModelById, deleteProductAssetModelByIdTransaction } from "@/function/cim/productAssetModel";
import { insertOldCurrentTransformerInfoTransaction, getOldCurrentTransformerInfoById } from "@/function/cim/oldCurrentTransformerInfo";
import { insertVoltageTransaction, getVoltageById, deleteVoltageByIdTransaction } from "@/function/cim/voltage";
import { insertCurrentFlowTransaction, getCurrentFlowById, deleteCurrentFlowByIdTransaction } from "@/function/cim/currentFlow";
import { insertSecondsTransaction, getSecondById, deleteSecondsByIdTransaction } from "@/function/cim/seconds";
import { insertFrequencyTransaction, getFrequencyById, deleteFrequencyByIdTransaction } from "@/function/cim/frequency";
import { insertResistanceTransaction, getResistanceById, deleteResistanceByIdTransaction } from "@/function/cim/resistance";
import { insertPercentTransaction, getPercentById, deletePercentByIdTransaction } from "@/function/cim/percent";
import { insertApparentPowerTransaction, getApparentPowerById, deleteApparentPowerByIdTransaction } from "@/function/cim/apparentPower";
import { insertTemperatureTransaction, getTemperatureById, deleteTemperatureByIdTransaction } from "@/function/cim/temperature";
import { insertCtCoreInfoTransaction, deleteCtCoreInfoByCurrentTransformerInfoIdTransaction, getCtCoreInfoByCurrentTransformerInfoId } from "@/function/cim/ctCoreInfo";
import { insertCtTapInfoTransaction, deleteCtTapInfoByCtCoreInfoIdTransaction, getCtTapInfoByCtCoreInfoId } from "@/function/cim/ctTapInfo";
import { insertAssetTransaction, getAssetById, deleteAssetByIdTransaction } from "@/function/cim/asset";
import { insertAssetPsrTransaction, getAssetPsrByAssetIdAndPsrId, deleteAssetPsrTransaction } from "@/function/entity/assetPsr";
import { insertLifecycleDateTransaction, getLifecycleDateById, deleteLifecycleDateByIdTransaction } from "@/function/cim/lifecycleDate";
import CurrentTransformerEntity from "@/views/Flatten/CurrentTransformer";
import { getAssetInfoById, insertAssetInfoTransaction, deleteAssetInfoByIdTransaction } from "@/function/cim/assetInfo";
import { getAttachmentByForeignIdAndType, deleteAttachmentByIdTransaction } from "@/function/entity/attachment";


export const insertCurrentTransformerEntity: any = async (old_entity: any, entity: any) => {

    try {
        if (entity.asset.mrid === null || entity.asset.mrid === '') {
            const result = {
                success: false,
                error: new Error("MRID is required for Current Transformer Entity"),
                message: '',
            }
            return result;
        } else {
            backupAllFilesInDir(null, null, entity.oldCurrentTransformerInfo.mrid);
            const syncResult = syncFilesWithDeletion(JSON.parse(entity.attachment.path), null, entity.oldCurrentTransformerInfo.mrid);
            if (!syncResult.success) {
                restoreFiles(null, null, entity.oldCurrentTransformerInfo.mrid);
                deleteBackupFiles(null, entity.oldCurrentTransformerInfo.mrid);
                const result = {
                    success: false,
                    error: new Error("MRID is required for Current Transformer Entity"),
                    message: '',
                }
                return result;
            }
        }
        await runAsync('BEGIN TRANSACTION');
        const _newVoltageIds = (entity.voltage || []).map((v: any) => v.mrid).filter((id: any) => id);
        void _newVoltageIds;
        const oldVoltageIds = (old_entity.voltage || []).map((v: any) => v.mrid).filter((id: any) => id);
        const toAddVoltage = (entity.voltage || []).filter((v: any) => v.mrid && !oldVoltageIds.includes(v.mrid));
        const toUpdateVoltage = (entity.voltage || []).filter((v: any) => v.mrid && oldVoltageIds.includes(v.mrid));
        for (const voltage of toAddVoltage) {
            await insertVoltageTransaction(voltage, db);
        }
        for (const voltage of toUpdateVoltage) {
            await insertVoltageTransaction(voltage, db);
        }
        const _newCurrentFlowIds = (entity.currentFlow || []).map((c: any) => c.mrid).filter((id: any) => id);
        void _newCurrentFlowIds;
        const oldCurrentFlowIds = (old_entity.currentFlow || []).map((c: any) => c.mrid).filter((id: any) => id);
        const toAddCurrentFlow = (entity.currentFlow || []).filter((c: any) => c.mrid && !oldCurrentFlowIds.includes(c.mrid));
        const toUpdateCurrentFlow = (entity.currentFlow || []).filter((c: any) => c.mrid && oldCurrentFlowIds.includes(c.mrid));
        for (const currentFlow of toAddCurrentFlow) {
            await insertCurrentFlowTransaction(currentFlow, db);
        }
        for (const currentFlow of toUpdateCurrentFlow) {
            await insertCurrentFlowTransaction(currentFlow, db);
        }
        const _newSecondsIds = (entity.seconds || []).map((s: any) => s.mrid).filter((id: any) => id);
        void _newSecondsIds;
        const oldSecondsIds = (old_entity.seconds || []).map((s: any) => s.mrid).filter((id: any) => id);
        const toAddSeconds = (entity.seconds || []).filter((s: any) => s.mrid && !oldSecondsIds.includes(s.mrid));
        const toUpdateSeconds = (entity.seconds || []).filter((s: any) => s.mrid && oldSecondsIds.includes(s.mrid));
        for (const seconds of toAddSeconds) {
            await insertSecondsTransaction(seconds, db);
        }
        for (const seconds of toUpdateSeconds) {
            await insertSecondsTransaction(seconds, db);
        }
        const _newFrequencyIds = (entity.frequency || []).map((f: any) => f.mrid).filter((id: any) => id);
        void _newFrequencyIds;
        const oldFrequencyIds = (old_entity.frequency || []).map((f: any) => f.mrid).filter((id: any) => id);
        const toAddFrequency = (entity.frequency || []).filter((f: any) => f.mrid && !oldFrequencyIds.includes(f.mrid));
        const toUpdateFrequency = (entity.frequency || []).filter((f: any) => f.mrid && oldFrequencyIds.includes(f.mrid));
        for (const frequency of toAddFrequency) {
            await insertFrequencyTransaction(frequency, db);
        }
        for (const frequency of toUpdateFrequency) {
            await insertFrequencyTransaction(frequency, db);
        }
        const _newResistanceIds = (entity.resistance || []).map((r: any) => r.mrid).filter((id: any) => id);
        void _newResistanceIds;
        const oldResistanceIds = (old_entity.resistance || []).map((r: any) => r.mrid).filter((id: any) => id);
        const toAddResistance = (entity.resistance || []).filter((r: any) => r.mrid && !oldResistanceIds.includes(r.mrid));
        const toUpdateResistance = (entity.resistance || []).filter((r: any) => r.mrid && oldResistanceIds.includes(r.mrid));
        for (const resistance of toAddResistance) {
            await insertResistanceTransaction(resistance, db);
        }
        for (const resistance of toUpdateResistance) {
            await insertResistanceTransaction(resistance, db);
        }
        const _newPercentIds = (entity.percent || []).map((p: any) => p.mrid).filter((id: any) => id);
        void _newPercentIds;
        const oldPercentIds = (old_entity.percent || []).map((p: any) => p.mrid).filter((id: any) => id);
        const toAddPercent = (entity.percent || []).filter((p: any) => p.mrid && !oldPercentIds.includes(p.mrid));
        const toUpdatePercent = (entity.percent || []).filter((p: any) => p.mrid && oldPercentIds.includes(p.mrid));
        for (const percent of toAddPercent) {
            await insertPercentTransaction(percent, db);
        }
        for (const percent of toUpdatePercent) {
            await insertPercentTransaction(percent, db);
        }
        const _newApparentPowerIds = (entity.apparentPower || []).map((a: any) => a.mrid).filter((id: any) => id);
        void _newApparentPowerIds;
        const oldApparentPowerIds = (old_entity.apparentPower || []).map((a: any) => a.mrid).filter((id: any) => id);
        const toAddApparentPower = (entity.apparentPower || []).filter((a: any) => a.mrid && !oldApparentPowerIds.includes(a.mrid));
        const toUpdateApparentPower = (entity.apparentPower || []).filter((a: any) => a.mrid && oldApparentPowerIds.includes(a.mrid));
        for (const apparentPower of toAddApparentPower) {
            await insertApparentPowerTransaction(apparentPower, db);
        }
        for (const apparentPower of toUpdateApparentPower) {
            await insertApparentPowerTransaction(apparentPower, db);
        }
        const _newTemperatureIds = (entity.temperature || []).map((t: any) => t.mrid).filter((id: any) => id);
        void _newTemperatureIds;
        const oldTemperatureIds = (old_entity.temperature || []).map((t: any) => t.mrid).filter((id: any) => id);
        const toAddTemperature = (entity.temperature || []).filter((t: any) => t.mrid && !oldTemperatureIds.includes(t.mrid));
        const toUpdateTemperature = (entity.temperature || []).filter((t: any) => t.mrid && oldTemperatureIds.includes(t.mrid));
        for (const temperature of toAddTemperature) {
            await insertTemperatureTransaction(temperature, db);
        }
        for (const temperature of toUpdateTemperature) {
            await insertTemperatureTransaction(temperature, db);
        }
        const productAssetModelResult: any = await insertProductAssetModelTransaction(entity.productAssetModel, db);
        void productAssetModelResult;

        await insertAssetInfoTransaction(entity.assetInfo, db);

        await insertOldCurrentTransformerInfoTransaction(entity.oldCurrentTransformerInfo, db);

        if (old_entity.CtCoreInfo && old_entity.CtCoreInfo.length > 0) {
            for (const core of old_entity.CtCoreInfo) {
                if (core.mrid) {
                    await deleteCtTapInfoByCtCoreInfoIdTransaction(core.mrid, db);
                }
            }

            const currentTransformerInfoId = old_entity.oldCurrentTransformerInfo.mrid;
            if (currentTransformerInfoId) {
                await deleteCtCoreInfoByCurrentTransformerInfoIdTransaction(currentTransformerInfoId, db);
            }
        }

        for (const ctCoreInfo of entity.CtCoreInfo) {
            await insertCtCoreInfoTransaction(ctCoreInfo, db);
        }

        for (const ctTapInfo of entity.CtTapInfo) {
            await insertCtTapInfoTransaction(ctTapInfo, db);
        }
        await insertLifecycleDateTransaction(entity.lifecycleDate, db);

        await insertAssetTransaction(entity.asset, db);
        await insertAssetPsrTransaction(entity.assetPsr, db);
        await runAsync('COMMIT');
        deleteBackupFiles(null, entity.oldCurrentTransformerInfo.mrid);
        return { success: true, data: entity, message: 'Current Transformer entity inserted successfully' };


    } catch (error: any) {
        restoreFiles(null, null, entity.oldCurrentTransformerInfo.mrid);
        deleteBackupFiles(null, entity.oldCurrentTransformerInfo.mrid);
        console.error('Error retrieving current transformer entity:', error);
        await runAsync('ROLLBACK');
        return { success: false, error, message: 'Error retrieving current transformer entity' };
    }
}

const addUnique = (array: any[], item: any) => {
    if (item && item.mrid && !array.some((i: any) => i.mrid === item.mrid)) {
        array.push(item);
    }
};

export const getCurrentTransformerEntityById: any = async (id: string, psrId: string) => {
    try {
        if (id == null || id === '') {
            return { success: false, error: new Error('Invalid ID') };
        } else {
            const entity = new CurrentTransformerEntity()
            const dataCurrentTransformer: any = await getAssetById(id)
            if (dataCurrentTransformer.success) {
                entity.asset = dataCurrentTransformer.data

                const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date)
                if (dataLifecycleDate.success) {
                    entity.lifecycleDate = dataLifecycleDate.data
                }
                const dataOldCurrentTransformerInfo: any = await getOldCurrentTransformerInfoById(entity.asset.asset_info)
                if (dataOldCurrentTransformerInfo.success) {
                    entity.oldCurrentTransformerInfo = dataOldCurrentTransformerInfo.data
                }

                const productAssetModelId = entity.asset.product_asset_model

                const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId)
                if (dataProductAssetModel.success) {
                    entity.productAssetModel = dataProductAssetModel.data
                }

                const dataAssetInfo: any = await getAssetInfoById(entity.asset.asset_info)
                if (dataAssetInfo.success) {
                    entity.assetInfo = dataAssetInfo.data
                }

                const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(entity.asset.mrid, psrId);
                if (dataAssetPsr.success) {
                    entity.assetPsr = dataAssetPsr.data;
                }

                const dataAttachment: any = await getAttachmentByForeignIdAndType(entity.asset.mrid, 'asset');
                if (dataAttachment.success) {
                    entity.attachment = dataAttachment.data;
                }

                if (entity.oldCurrentTransformerInfo) {
                    const info = entity.oldCurrentTransformerInfo;
                    const [
                        ratedFreq, umRms, uWithstandRms, uLightningPeak, iCth, iDynPeak, ithRms,
                        ithDuration, sysVoltage, bil, ratingFactorTemp, accuracyLimit, kneePointCurrent,
                        kneePointVoltage, primaryFlsRating, ratedCurrent, secondaryFlsRating, tertiaryFlsRating
                    ]: any[] = await Promise.all([
                        getFrequencyById(info.rated_frequency),
                        getVoltageById(info.um_rms),
                        getVoltageById(info.u_withstand_rms),
                        getVoltageById(info.u_lightning_peak),
                        getCurrentFlowById(info.i_cth),
                        getCurrentFlowById(info.i_dynamic_peak),
                        getCurrentFlowById(info.ith_rms),
                        getSecondById(info.ith_duration),
                        getVoltageById(info.system_voltage),
                        getVoltageById(info.bil),
                        getTemperatureById(info.rating_factor_temp),
                        getCurrentFlowById(info.accuracy_limit),
                        getCurrentFlowById(info.knee_point_current),
                        getVoltageById(info.knee_point_voltage),
                        getCurrentFlowById(info.primary_fls_rating),
                        getCurrentFlowById(info.rated_current),
                        getCurrentFlowById(info.secondary_fls_rating),
                        getCurrentFlowById(info.tertiary_fls_rating)
                    ]);

                    if (ratedFreq.success) addUnique(entity.frequency, ratedFreq.data);
                    if (umRms.success) addUnique(entity.voltage, umRms.data);
                    if (uWithstandRms.success) addUnique(entity.voltage, uWithstandRms.data);
                    if (uLightningPeak.success) addUnique(entity.voltage, uLightningPeak.data);
                    if (iCth.success) addUnique(entity.currentFlow, iCth.data);
                    if (iDynPeak.success) addUnique(entity.currentFlow, iDynPeak.data);
                    if (ithRms.success) addUnique(entity.currentFlow, ithRms.data);
                    if (ithDuration.success) addUnique(entity.seconds, ithDuration.data);
                    if (sysVoltage.success) addUnique(entity.voltage, sysVoltage.data);
                    if (bil.success) addUnique(entity.voltage, bil.data);
                    if (ratingFactorTemp.success) addUnique(entity.temperature, ratingFactorTemp.data);
                    if (accuracyLimit.success) addUnique(entity.currentFlow, accuracyLimit.data);
                    if (kneePointCurrent.success) addUnique(entity.currentFlow, kneePointCurrent.data);
                    if (kneePointVoltage.success) addUnique(entity.voltage, kneePointVoltage.data);
                    if (primaryFlsRating.success) addUnique(entity.currentFlow, primaryFlsRating.data);
                    if (ratedCurrent.success) addUnique(entity.currentFlow, ratedCurrent.data);
                    if (secondaryFlsRating.success) addUnique(entity.currentFlow, secondaryFlsRating.data);
                    if (tertiaryFlsRating.success) addUnique(entity.currentFlow, tertiaryFlsRating.data);
                }

                const dataCtCoreInfo: any = await getCtCoreInfoByCurrentTransformerInfoId(entity.oldCurrentTransformerInfo.mrid);
                if (dataCtCoreInfo.success && dataCtCoreInfo.data) {
                    for (const ctCoreInfo of dataCtCoreInfo.data) {
                        entity.CtCoreInfo.push(ctCoreInfo);

                        const [windingResistance, vb, ratioError]: any[] = await Promise.all([
                            getResistanceById(ctCoreInfo.winding_resistance),
                            getVoltageById(ctCoreInfo.vb),
                            getPercentById(ctCoreInfo.ratio_error)
                        ]);
                        if (windingResistance.success) addUnique(entity.resistance, windingResistance.data);
                        if (vb.success) addUnique(entity.voltage, vb.data);
                        if (ratioError.success) addUnique(entity.percent, ratioError.data);

                        const dataCtTapInfo: any = await getCtTapInfoByCtCoreInfoId(ctCoreInfo.mrid);
                        if (dataCtTapInfo.success && dataCtTapInfo.data) {
                            for (const ctTapInfo of dataCtTapInfo.data) {
                                entity.CtTapInfo.push(ctTapInfo);

                                const [ipn, isn, burden, operatingBurden, ratedBurden]: any[] = await Promise.all([
                                    getCurrentFlowById(ctTapInfo.ipn),
                                    getCurrentFlowById(ctTapInfo.isn),
                                    getApparentPowerById(ctTapInfo.burden),
                                    getApparentPowerById(ctTapInfo.operating_burden),
                                    getApparentPowerById(ctTapInfo.rated_burden)
                                ]);
                                if (ipn.success) addUnique(entity.currentFlow, ipn.data);
                                if (isn.success) addUnique(entity.currentFlow, isn.data);
                                if (burden.success) addUnique(entity.apparentPower, burden.data);
                                if (operatingBurden.success) addUnique(entity.apparentPower, operatingBurden.data);
                                if (ratedBurden.success) addUnique(entity.apparentPower, ratedBurden.data);
                            }
                        }
                    }
                }

                return {
                    success: true,
                    data: entity,
                    message: 'Current Transformer entity retrieved successfully'
                }

            } else {
                return { success: false, error: dataCurrentTransformer.error, message: dataCurrentTransformer.message };
            }
        }

    } catch (error) {
        console.error("Error retrieving Current Transformer entity by ID:", error);
        return { success: false, error, message: 'Error retrieving Current Transformer entity by ID' };
    }
}

export const deleteCurrentTransformerEntity: any = async (data: any) => {
    try {
        if (data.oldCurrentTransformerInfo == null || data.oldCurrentTransformerInfo.mrid == null || data.oldCurrentTransformerInfo.mrid === '') {
            return { success: false, error: new Error('Invalid ID') };
        } else {
            try {
                await runAsync('BEGIN TRANSACTION');
                if (data.attachment && data.attachment.id) {
                    const pathData = JSON.parse(data.attachment.path || '[]')
                    if (Array.isArray(pathData) && pathData.length > 0) {
                        syncFilesWithDeletion(pathData, null, data.mrid);
                    }
                }
                if (data.attachment.id) {
                    await deleteAttachmentByIdTransaction(data.attachment.id, db);
                }
                if (data.assetPsr && data.assetPsr.mrid) {
                    await deleteAssetPsrTransaction(data.assetPsr.mrid, db);
                }
                if (data.CtCoreInfo && data.CtCoreInfo.length > 0) {
                    for (const core of data.CtCoreInfo) {
                        if (core.mrid) {
                            await deleteCtTapInfoByCtCoreInfoIdTransaction(core.mrid, db);
                        }
                    }
                }
                if (data.oldCurrentTransformerInfo && data.oldCurrentTransformerInfo.mrid) {
                    await deleteCtCoreInfoByCurrentTransformerInfoIdTransaction(data.oldCurrentTransformerInfo.mrid, db);
                }

                await deleteAssetByIdTransaction(data.asset.mrid, db);
                if (data.assetInfo && data.assetInfo.mrid) {
                    await deleteAssetInfoByIdTransaction(data.assetInfo.mrid, db);
                }
                if (data.productAssetModel && data.productAssetModel.mrid) {
                    await deleteProductAssetModelByIdTransaction(data.productAssetModel.mrid, db);
                }
                if (data.lifecycleDate && data.lifecycleDate.mrid) {
                    await deleteLifecycleDateByIdTransaction(data.lifecycleDate.mrid, db);
                }
                for (const voltage of data.voltage) {
                    if (voltage.mrid) {
                        await deleteVoltageByIdTransaction(voltage.mrid, db);
                    }
                }
                for (const currentFlow of data.currentFlow) {
                    if (currentFlow.mrid) {
                        await deleteCurrentFlowByIdTransaction(currentFlow.mrid, db);
                    }
                }
                for (const seconds of data.seconds) {
                    if (seconds.mrid) {
                        await deleteSecondsByIdTransaction(seconds.mrid, db);
                    }
                }
                for (const frequency of data.frequency) {
                    if (frequency.mrid) {
                        await deleteFrequencyByIdTransaction(frequency.mrid, db);
                    }
                }
                for (const resistance of data.resistance) {
                    if (resistance.mrid) {
                        await deleteResistanceByIdTransaction(resistance.mrid, db);
                    }
                }
                for (const percent of data.percent) {
                    if (percent.mrid) {
                        await deletePercentByIdTransaction(percent.mrid, db);
                    }
                }
                for (const apparentPower of data.apparentPower) {
                    if (apparentPower.mrid) {
                        await deleteApparentPowerByIdTransaction(apparentPower.mrid, db);
                    }
                }
                for (const temperature of data.temperature) {
                    if (temperature.mrid) {
                        await deleteTemperatureByIdTransaction(temperature.mrid, db);
                    }
                }

                await runAsync('COMMIT');
                return { success: true, message: 'Current Transformer entity deleted successfully' };

            } catch (error: any) {
                await runAsync('ROLLBACK');
                console.error('Error deleting Current Transformer entity:', error);
                return { success: false, error, message: 'Error deleting Current Transformer entity' };
            }
        }
    } catch (error) {
        console.error('Error deleting Current Transformer entity:', error);
        return { success: false, error, message: 'Error deleting Current Transformer entity' };
    }
}

const runAsync = (sql: string, params: any[] = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err: any) {
            if (err) reject(err);
            else resolve(undefined);
        });
    });
};