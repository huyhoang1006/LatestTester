import db from '../../datacontext/index'
import path from 'path'
import * as attachmentContext from '../../attachmentcontext/index'
import { uploadAttachmentTransaction, backupAllFilesInDir, deleteBackupFiles, restoreFiles, syncFilesWithDeletion, getAttachmentByForeignIdAndType, deleteAttachmentByIdTransaction, deleteDirectory } from '@/function/entity/attachment'
import { insertVoltageTransaction, getVoltageByIds, deleteVoltageByIdTransaction } from '@/function/cim/voltage';
import { insertCurrentFlowTransaction, getCurrentFlowByIds, deleteCurrentFlowByIdTransaction } from '@/function/cim/currentFlow';
import { insertLifecycleDateTransaction, getLifecycleDateById, deleteLifecycleDateByIdTransaction } from '@/function/cim/lifecycleDate';
import { insertProductAssetModelTransaction, getProductAssetModelById, deleteProductAssetModelByIdTransaction } from '@/function/cim/productAssetModel';
import { insertAssetPsrTransaction, getAssetPsrByAssetIdAndPsrId, deleteAssetPsrTransaction } from '@/function/entity/assetPsr'
import { insertFrequencyTransaction, getFrequencyByIds, deleteFrequencyByIdTransaction } from '@/function/cim/frequency';
import { insertAssetTransaction, getAssetById, deleteAssetByIdTransaction } from '@/function/cim/asset';
import { insertRotatingMachineInfoTransaction, getRotatingMachineInfoById, deleteRotatingMachineInfoTransaction } from '@/function/cim/rotatingMachineInfo';
import { insertApparentPowerTransaction, getApparentPowerByIds, deleteApparentPowerByIdTransaction } from '@/function/cim/apparentPower';
import RotatingMachineEntity from '@/views/Flatten/RotatingMachine';

export const insertRotatingMachineEntity: any = async (entity: any) => {
    try {
        if (entity.asset.mrid === null || entity.asset.mrid === '') {
            return {
                success: false,
                error: new Error("MRID is required for Rotating Machine Entity"),
                message: '',
            };
        } else {
            backupAllFilesInDir(null, null, entity.asset.mrid);
            const syncResult = syncFilesWithDeletion(JSON.parse(entity.attachment.path), null, entity.asset.mrid);

            if (!syncResult.success) {
                restoreFiles(null, null, entity.asset.mrid);
                deleteBackupFiles(null, entity.asset.mrid);
                return {
                    success: false,
                    error: new Error("MRID is required for Rotating Machine Entity"),
                    message: '',
                };
            }
            await runAsync('BEGIN TRANSACTION');

            for (const currentFlow of entity.currentFlow) {
                if (currentFlow.mrid) {
                    await insertCurrentFlowTransaction(currentFlow, db);
                }
            }

            for (const frequency of entity.frequency) {
                if (frequency.mrid) {
                    await insertFrequencyTransaction(frequency, db);
                }
            }

            for (const voltage of entity.voltage) {
                if (voltage.mrid) {
                    await insertVoltageTransaction(voltage, db);
                }
            }

            for (const apparentPower of entity.apparentPower) {
                if (apparentPower.mrid) {
                    await insertApparentPowerTransaction(apparentPower, db);
                }
            }

            await insertRotatingMachineInfoTransaction(entity.rotatingMachine, db);
            await insertLifecycleDateTransaction(entity.lifecycleDate, db);
            await insertProductAssetModelTransaction(entity.productAssetModel, db);
            await insertAssetTransaction(entity.asset, db);
            await insertAssetPsrTransaction(entity.assetPsr, db);

            if (entity.attachment.id && Array.isArray(JSON.parse(entity.attachment.path))) {
                const pathData = JSON.parse(entity.attachment.path);
                const newPath: any[] = [];
                for (let i = 0; i < pathData.length; i++) {
                    const namefile = path.basename(pathData[i].path);
                    pathData[i].path = path.join(attachmentContext.getAttachmentDir(), entity.asset.mrid, namefile);
                    newPath.push(pathData[i]);
                }
                entity.attachment.path = JSON.stringify(newPath);
                await uploadAttachmentTransaction(entity.attachment, db);
            }

            await runAsync('COMMIT');
            deleteBackupFiles(null, entity.asset.mrid);
            return { success: true, data: entity, message: 'Rotating machine entity inserted successfully' };
        }
    } catch (error: any) {
        restoreFiles(null, null, entity.asset.mrid);
        deleteBackupFiles(null, entity.asset.mrid);
        console.error('Error retrieving Rotating Machine entity:', error);
        await runAsync('ROLLBACK');
        return { success: false, error, message: 'Error retrieving Rotating Machine entity' };
    }
}

export const getRotatingMachineEntity: any = async (id: string, psrId: string) => {
    try {
        if (id == null || id === '') {
            return { success: false, error: new Error('Invalid ID') };
        } else {
            const entity = new RotatingMachineEntity()
            const dataRotatingMachine: any = await getAssetById(id);
            if (dataRotatingMachine.success) {
                entity.asset = dataRotatingMachine.data
                const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date);
                if (dataLifecycleDate.success) {
                    entity.lifecycleDate = dataLifecycleDate.data;
                }

                const dataRotatingMachineInfo: any = await getRotatingMachineInfoById(entity.asset.asset_info);
                if (dataRotatingMachineInfo.success) {
                    entity.rotatingMachine = dataRotatingMachineInfo.data;
                }

                const dataProductAssetModel: any = await getProductAssetModelById(entity.asset.product_asset_model);
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

                const rotating_arr: any = {
                    voltage: ['rated_u', 'rated_ufd'],
                    currentFlow: ['rated_current', 'rated_ifd'],
                    frequency: ['rated_frequency'],
                    apparentPower: ['rated_power'],
                }

                let voltage: any[] = [];
                let currentFlow: any[] = [];
                let frequency: any[] = [];
                let apparentPower: any[] = [];

                for (const key in rotating_arr) {
                    for (const item of rotating_arr[key]) {
                        if (entity.rotatingMachine[item]) {
                            switch (key) {
                                case 'voltage':
                                    voltage.push(entity.rotatingMachine[item]);
                                    break;
                                case 'currentFlow':
                                    currentFlow.push(entity.rotatingMachine[item]);
                                    break;
                                case 'frequency':
                                    frequency.push(entity.rotatingMachine[item]);
                                    break;
                                case 'apparentPower':
                                    apparentPower.push(entity.rotatingMachine[item]);
                                    break;
                            }
                        }
                    }
                }

                if (voltage.length > 0) {
                    const dataVoltage: any = await getVoltageByIds(voltage);
                    if (dataVoltage.success) {
                        entity.voltage = dataVoltage.data;
                    }
                }

                if (currentFlow.length > 0) {
                    const dataCurrentFlow: any = await getCurrentFlowByIds(currentFlow);
                    if (dataCurrentFlow.success) {
                        entity.currentFlow = dataCurrentFlow.data;
                    }
                }

                if (frequency.length > 0) {
                    const dataFrequency: any = await getFrequencyByIds(frequency);
                    if (dataFrequency.success) {
                        entity.frequency = dataFrequency.data;
                    }
                }

                if (apparentPower.length > 0) {
                    const dataApparentPower: any = await getApparentPowerByIds(apparentPower);
                    if (dataApparentPower.success) {
                        entity.apparentPower = dataApparentPower.data;
                    }
                }
                return {
                    success: true,
                    data: entity,
                    message: 'Rotating Machine entity retrieved successfully'
                }
            } else {
                return { success: false, error: dataRotatingMachine.error, message: dataRotatingMachine.message };
            }
        }
    } catch (error: any) {
        console.error("Error retrieving Rotating Machine entity by ID:", error);
        return { success: false, error, message: 'Error retrieving Rotating Machine entity by ID' };
    }
};

export const deleteRotatingMachineEntity: any = async (entity: any) => {
    try {
        await runAsync('BEGIN TRANSACTION');

        if (entity.attachment && entity.attachment.id) {
            await deleteAttachmentByIdTransaction(entity.attachment.id, db);
            if (entity.asset && entity.asset.mrid) {
                const dirPath = path.join(attachmentContext.getAttachmentDir(), entity.asset.mrid);
                await deleteDirectory(dirPath);
            }
        }

        if (entity.assetPsr && entity.assetPsr.mrid) {
            await deleteAssetPsrTransaction(entity.assetPsr.mrid, db);
        }
        if (entity.asset && entity.asset.mrid) {
            await deleteAssetByIdTransaction(entity.asset.mrid, db);
        }
        if (entity.productAssetModel && entity.productAssetModel.mrid) {
            await deleteProductAssetModelByIdTransaction(entity.productAssetModel.mrid, db);
        }
        if (entity.lifecycleDate && entity.lifecycleDate.mrid) {
            await deleteLifecycleDateByIdTransaction(entity.lifecycleDate.mrid, db);
        }
        if (entity.rotatingMachine && entity.rotatingMachine.mrid) {
            await deleteRotatingMachineInfoTransaction(entity.rotatingMachine.mrid, db);
        }
        for (const currentFlow of entity.currentFlow || []) {
            if (currentFlow.mrid) await deleteCurrentFlowByIdTransaction(currentFlow.mrid, db);
        }
        for (const volt of entity.voltage || []) {
            if (volt.mrid) await deleteVoltageByIdTransaction(volt.mrid, db);
        }
        for (const freq of entity.frequency || []) {
            if (freq.mrid) await deleteFrequencyByIdTransaction(freq.mrid, db);
        }
        for (const power of entity.apparentPower || []) {
            if (power.mrid) await deleteApparentPowerByIdTransaction(power.mrid, db);
        }

        await runAsync('COMMIT');
        return { success: true, message: 'Rotating Machine entity deleted successfully' };
    } catch (error: any) {
        await runAsync('ROLLBACK');
        console.error('Error deleting Rotating Machine entity:', error);
        return { success: false, error, message: 'Error deleting Rotating Machine entity' };
    }
};


const runAsync: any = (sql: string, params: any[] = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err: any) {
            if (err) reject(err);
            else resolve(undefined);
        });
    });
};