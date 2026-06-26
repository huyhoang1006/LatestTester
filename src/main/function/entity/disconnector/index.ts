import db from '../../datacontext/index'
import path from 'path'
import { uploadAttachmentTransaction, backupAllFilesInDir, deleteBackupFiles, restoreFiles, syncFilesWithDeletion, getAttachmentByForeignIdAndType, deleteAttachmentByIdTransaction, deleteDirectory } from '@/function/entity/attachment'
import * as attachmentContext from '@/function/attachmentcontext'
import { insertVoltageTransaction, deleteVoltageByIdTransaction } from '@/function/cim/voltage';
import { insertSecondsTransaction, deleteSecondsByIdTransaction } from '@/function/cim/seconds';
import { insertCurrentFlowTransaction, deleteCurrentFlowByIdTransaction } from '@/function/cim/currentFlow';
import { insertFrequencyTransaction, deleteFrequencyByIdTransaction } from '@/function/cim/frequency';
import { getDisconnectorInfoById, insertDisconnectorInfoTransaction, deleteDisconnectorInfoTransaction } from '@/function/cim/disconnectorInfo';
import { getSwitchInfoById } from '@/function/cim/switchInfo';
import { getOldSwitchInfoById } from '@/function/cim/oldSwitchInfo';
import { getVoltageById } from '@/function/cim/voltage';
import { getFrequencyById } from '@/function/cim/frequency';
import { getCurrentFlowById } from '@/function/cim/currentFlow';
import { getSecondById } from '@/function/cim/seconds';
import DisconnectorEntity from '@/views/Flatten/Disconnector';
import { insertAssetTransaction, getAssetById } from '@/function/cim/asset';
import { deleteAssetByIdTransaction } from '@/function/cim/asset';
import { insertAssetPsrTransaction, getAssetPsrByAssetIdAndPsrId, deleteAssetPsrTransaction } from '@/function/entity/assetPsr'
import { insertLifecycleDateTransaction, getLifecycleDateById, deleteLifecycleDateByIdTransaction } from '@/function/cim/lifecycleDate';
import { insertProductAssetModelTransaction, getProductAssetModelById, deleteProductAssetModelByIdTransaction } from '@/function/cim/productAssetModel';


export const insertDisconnectorEntity: any = async (entity: any) => {
    try {
        if (entity.asset.mrid === null || entity.asset.mrid === '') {
            const result = {
                success: false,
                error: new Error("MRID is required for Disconnector Entity"),
                message: '',
            }
            return result;
        } else {
            backupAllFilesInDir(null, null, entity.asset.mrid);
            const syncResult = syncFilesWithDeletion(JSON.parse(entity.attachment.path), null, entity.asset.mrid);
            if (!syncResult.success) {
                restoreFiles(null, null, entity.asset.mrid);
                deleteBackupFiles(null, entity.asset.mrid);
                const result = {
                    success: false,
                    error: new Error("MRID is required for Disconnector Entity"),
                    message: '',
                }
                return result;
            }
            await runAsync('BEGIN TRANSACTION');

            //voltage
            for (const voltage of entity.voltage) {
                if (voltage.mrid) {
                    await insertVoltageTransaction(voltage, db);
                }
            }

            //frequency
            for (const frequency of entity.frequency) {
                if (frequency.mrid) {
                    await insertFrequencyTransaction(frequency, db);
                }
            }

            //second
            for (const second of entity.seconds) {
                if (second.mrid) {
                    await insertSecondsTransaction(second, db);
                }
            }

            //currentFlow
            for (const currentFlow of entity.currentFlow) {
                if (currentFlow.mrid) {
                    await insertCurrentFlowTransaction(currentFlow, db);
                }
            }


            try {
                await insertLifecycleDateTransaction(entity.lifecycleDate, db);
            } catch (error: any) {
                console.error('Error inserting LifecycleDate:', error);
                throw error;
            }

            try {
                await insertProductAssetModelTransaction(entity.productAssetModel, db);
            } catch (error: any) {
                console.error('Error inserting ProductAssetModel:', error);
                throw error;
            }

            try {
                await insertDisconnectorInfoTransaction(entity.disconnectorInfo, db);
            } catch (error: any) {
                console.error('Error inserting DisconnectorInfo:', error);
                throw error;
            }

            try {
                await insertAssetTransaction(entity.asset, db);
            } catch (error: any) {
                console.error('Error inserting Asset:', error);
                throw error;
            }

            try {
                await insertAssetPsrTransaction(entity.assetPsr, db);
            } catch (error: any) {
                console.error('Error inserting AssetPsr:', error);
                throw error;
            }

            if (entity.attachment.id && Array.isArray(JSON.parse(entity.attachment.path))) {
                const pathData = JSON.parse(entity.attachment.path);
                const newPath: any[] = []
                for (let i = 0; i < pathData.length; i++) {
                    const namefile = path.basename(pathData[i].path);
                    pathData[i].path = path.join(attachmentContext.getAttachmentDir(), entity.asset.mrid, namefile);
                    newPath.push(pathData[i]);
                }
                entity.attachment.path = JSON.stringify(newPath);
                await uploadAttachmentTransaction(entity.attachment, db);
            }

            await runAsync('COMMIT');
            return { success: true, data: entity, message: 'Insert disconnector entity completed' };

        }
    } catch (error: any) {
        restoreFiles(null, null, entity.asset.mrid);
        deleteBackupFiles(null, entity.asset.mrid);
        console.error('Error retrieving disconnector entity:', error);
        await runAsync('ROLLBACK');
        return { success: false, error, message: 'Error retrieving disconnector entity' };
    }
}


export const getDisconnectorEntityById: any = async (id: string, psrId: string) => {
    try {
        if (id == null || id === '') {
            return { success: false, error: new Error('Invalid ID') };
        } else {
            const entity = new DisconnectorEntity()
            const dataDisconnector: any = await getAssetById(id);
            if (dataDisconnector.success) {
                entity.asset = dataDisconnector.data
                const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date);
                if (dataLifecycleDate.success) {
                    entity.lifecycleDate = dataLifecycleDate.data;
                }
                const dataDisconnectorInfo: any = await getDisconnectorInfoById(entity.asset.asset_info);
                if (dataDisconnectorInfo.success) {
                    entity.disconnectorInfo = dataDisconnectorInfo.data;
                }
                try {
                    const switchInfoRes: any = await getSwitchInfoById(entity.asset.asset_info)
                    if (switchInfoRes.success && switchInfoRes.data) {
                        const sw = switchInfoRes.data
                        entity.disconnectorInfo = {
                            ...entity.disconnectorInfo,
                            rated_voltage: sw.rated_voltage || entity.disconnectorInfo.rated_voltage,
                            rated_frequency: sw.rated_frequency || entity.disconnectorInfo.rated_frequency,
                            rated_current: sw.rated_current || entity.disconnectorInfo.rated_current,
                            short_time_withstand_current: sw.short_time_withstand_current || entity.disconnectorInfo.short_time_withstand_current
                        }
                    }
                } catch (e: any) {
                    console.error('Error merging switch_info into disconnectorInfo:', e)
                }

                try {
                    const oldSwRes: any = await getOldSwitchInfoById(entity.asset.asset_info)
                    if (oldSwRes.success && oldSwRes.data) {
                        const oldSw = oldSwRes.data
                        if (oldSw.withstand_current && !entity.disconnectorInfo.short_time_withstand_current) {
                            entity.disconnectorInfo.short_time_withstand_current = oldSw.withstand_current
                        }
                    }
                } catch (e: any) {
                    console.error('Error merging old_switch_info into disconnectorInfo:', e)
                }
                try {
                    const info = entity.disconnectorInfo || {};
                    if (info.rated_voltage) {
                        const v: any = await getVoltageById(info.rated_voltage);
                        if (v.success && v.data) entity.voltage.push(v.data);
                    }
                    if (info.withstand_voltage_earth_poles) {
                        const v2: any = await getVoltageById(info.withstand_voltage_earth_poles);
                        if (v2.success && v2.data) entity.voltage.push(v2.data);
                    }
                    if (info.rated_frequency) {
                        const f: any = await getFrequencyById(info.rated_frequency);
                        if (f.success && f.data) entity.frequency.push(f.data);
                    }
                    if (info.power_frequency_isolating_distance) {
                        const f2: any = await getFrequencyById(info.power_frequency_isolating_distance);
                        if (f2.success && f2.data) entity.frequency.push(f2.data);
                    }
                    if (info.rated_current) {
                        const c: any = await getCurrentFlowById(info.rated_current);
                        if (c.success && c.data) entity.currentFlow.push(c.data);
                    }
                    if (info.short_time_withstand_current) {
                        const c2: any = await getCurrentFlowById(info.short_time_withstand_current);
                        if (c2.success && c2.data) entity.currentFlow.push(c2.data);
                    }
                    if (info.rated_duration_short_circuit) {
                        const s: any = await getSecondById(info.rated_duration_short_circuit);
                        if (s.success && s.data) entity.seconds.push(s.data);
                    }
                } catch (e: any) {
                    console.error('Error loading ratings data for Disconnector entity:', e);
                }

                const productAssetModelId = entity.disconnectorInfo.product_asset_model;
                const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId);
                if (dataProductAssetModel.success) {
                    entity.productAssetModel = dataProductAssetModel.data;
                }

                const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(entity.asset.mrid, psrId);
                if (dataAssetPsr.success) {
                    entity.assetPsr = dataAssetPsr.data;
                }

                const dataAttachment: any = await getAttachmentByForeignIdAndType(entity.asset.mrid, 'asset');
                if (dataAttachment.success) {
                    entity.attachment = dataAttachment.data;
                }

                return {
                    success: true,
                    data: entity,
                    message: 'Disconnector entity retrieved successfully'
                }
            } else {
                return { success: false, error: dataDisconnector.error, message: dataDisconnector.message };
            }
        }
    } catch (error: any) {
        console.error("Error retrieving Disconnector entity by ID:", error);
        return { success: false, error, message: 'Error retrieving Disconnector entity by ID' };
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

export const deleteDisconnectorEntity: any = async (data: any) => {
    try {
        if (!data || !data.asset || !data.asset.mrid) {
            return { success: false, error: new Error('Invalid ID'), message: 'Invalid ID' };
        }

        try {
            await runAsync('BEGIN TRANSACTION');

            if (data.attachment && data.attachment.id) {
                const pathData = JSON.parse(data.attachment.path || '[]')
                if (Array.isArray(pathData) && pathData.length > 0) {
                    syncFilesWithDeletion(pathData, null, data.asset.mrid);
                }
            }

            if (data.attachment && data.attachment.id) {
                await deleteAttachmentByIdTransaction(data.attachment.id, db);
            }

            if (data.assetPsr && data.assetPsr.mrid) {
                await deleteAssetPsrTransaction(data.assetPsr.mrid, db);
            }

            if (data.asset && data.asset.mrid) {
                await deleteAssetByIdTransaction(data.asset.mrid, db);
            }

            if (data.disconnectorInfo && data.disconnectorInfo.mrid) {
                const mridInfo = data.disconnectorInfo.mrid;
                const delInfoRes: any = await deleteDisconnectorInfoTransaction(mridInfo, db);
                if (!delInfoRes || delInfoRes.success === false) {
                    throw (delInfoRes && delInfoRes.err) || new Error('Delete DisconnectorInfo failed');
                }
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

            for (const frequency of data.frequency) {
                if (frequency.mrid) {
                    await deleteFrequencyByIdTransaction(frequency.mrid, db);
                }
            }

            for (const second of data.seconds) {
                if (second.mrid) {
                    await deleteSecondsByIdTransaction(second.mrid, db);
                }
            }

            for (const currentFlow of data.currentFlow) {
                if (currentFlow.mrid) {
                    await deleteCurrentFlowByIdTransaction(currentFlow.mrid, db);
                }
            }

            await runAsync('COMMIT');

            if (data.attachment && data.attachment.id) {
                deleteDirectory(null, data.asset.mrid);
            }

            return { success: true, message: 'Disconnector entity deleted successfully' };
        } catch (error: any) {
            await runAsync('ROLLBACK');
            console.error('Error deleting Disconnector entity:', error);
            return { success: false, error, message: 'Error deleting Disconnector entity' };
        }
    } catch (error: any) {
        console.error('Error deleting Disconnector entity:', error);
        return { success: false, error, message: 'Error deleting Disconnector entity' };
    }
}