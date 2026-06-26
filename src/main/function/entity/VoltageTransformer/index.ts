import db from '../../datacontext/index'
import { backupAllFilesInDir, deleteBackupFiles, restoreFiles, syncFilesWithDeletion, getAttachmentByForeignIdAndType, deleteAttachmentByIdTransaction, deleteDirectory } from '@/function/entity/attachment'
import { insertVoltageTransaction, getVoltageById, deleteVoltageByIdTransaction } from '@/function/cim/voltage'
import { insertFrequencyTransaction, getFrequencyById, deleteFrequencyByIdTransaction } from '@/function/cim/frequency'
import { insertApparentPowerTransaction, getApparentPowerById, deleteApparentPowerByIdTransaction } from '@/function/cim/apparentPower'
import { insertLifecycleDateTransaction, getLifecycleDateById, deleteLifecycleDateByIdTransaction } from '@/function/cim/lifecycleDate'
import { insertProductAssetModelTransaction, getProductAssetModelById, deleteProductAssetModelByIdTransaction } from '@/function/cim/productAssetModel'
import { insertAssetTransaction, getAssetById, deleteAssetByIdTransaction } from '@/function/cim/asset'
import { insertOldPotentialTransformerTransaction, getOldPotentialTransformerInfoById, deleteOldPotentialTransformerInfoTransaction } from '@/function/cim/OldPotentialTransformerInfo/index.js'
import { insertPotentialTransformerTable, deletePotentialTransformerTableByPotentialTransformerInfoId, getPotentialTransformerTableByPotentialTransformerInfoId } from '@/function/cim/PotentialTransformerTable/index.js'
import { insertAssetPsrTransaction, getAssetPsrByAssetIdAndPsrId, deleteAssetPsrTransaction } from '@/function/entity/assetPsr'
import VoltageTransformerEntity from '@/views/Flatten/VoltageTransformer'
import { getAssetInfoById } from '@/function/cim/assetInfo'

const syncUnit: any = (newList: any[], oldList: any[], insertFn: any, dbsql: any) => {
    const newIds: any[] = (newList || []).map((v: any) => v.mrid).filter((id: any) => id);
    void newIds;
    const oldIds: any[] = (oldList || []).map((v: any) => v.mrid).filter((id: any) => id);
    const toAdd = (newList || []).filter((v: any) => v.mrid && !oldIds.includes(v.mrid));
    const toUpdate = (newList || []).filter((v: any) => v.mrid && oldIds.includes(v.mrid));
    for (const item of toAdd) insertFn(item, dbsql);
    for (const item of toUpdate) insertFn(item, dbsql);
};

export const insertVoltageTransformerEntity: any = async (old_entity: any, entity: any) => {
    try {
        if (entity.asset.mrid === null || entity.asset.mrid === '') {
            return { success: false, error: new Error("MRID is required for Voltage Transformer Entity"), message: '' };
        } else {
            backupAllFilesInDir(null, null, entity.OldPotentialTransformerInfo.mrid);
            const syncResult = syncFilesWithDeletion(JSON.parse(entity.attachment.path), null, entity.OldPotentialTransformerInfo.mrid);
            if (!syncResult.success) {
                restoreFiles(null, null, entity.OldPotentialTransformerInfo.mrid);
                deleteBackupFiles(null, entity.OldPotentialTransformerInfo.mrid);
                return { success: false, error: new Error("MRID is required for Surge Arrester Entity"), message: '' };
            }
            await runAsync('BEGIN TRANSACTION');
            syncUnit(entity.voltage, old_entity.voltage, insertVoltageTransaction, db);
            syncUnit(entity.frequency, old_entity.frequency, insertFrequencyTransaction, db);
            syncUnit(entity.apparentPower, old_entity.apparentPower, insertApparentPowerTransaction, db);

            const productAssetModelResult: any = await insertProductAssetModelTransaction(entity.productAssetModel, db);
            void productAssetModelResult;

            await insertOldPotentialTransformerTransaction(entity.OldPotentialTransformerInfo, db);

            await insertLifecycleDateTransaction(entity.lifecycleDate, db);

            await insertAssetTransaction(entity.asset, db);
            await insertAssetPsrTransaction(entity.assetPsr, db);

            await deletePotentialTransformerTableByPotentialTransformerInfoId(entity.OldPotentialTransformerInfo.mrid, db);

            for (const table of entity.potentialTransformerTable) {
                await insertPotentialTransformerTable(table, db);
            }
            await runAsync('COMMIT');
            deleteBackupFiles(null, entity.OldPotentialTransformerInfo.mrid);
            return { success: true, data: entity, message: 'Voltage Transformer entity inserted successfully' };
        }
    } catch (error: any) {
        restoreFiles(null, null, entity.OldPotentialTransformerInfo.mrid);
        deleteBackupFiles(null, entity.OldPotentialTransformerInfo.mrid);
        console.error('Error retrieving voltage transformer entity:', error);
        await runAsync('ROLLBACK');
        return { success: false, error, message: 'Error retrieving voltage transformer entity' };
    }
}

export const getVoltageTransformerEntityById: any = async (id: string, psrId: string) => {
    try {
        if (id == null || id === '') {
            return { success: false, error: new Error('Invalid ID') };
        } else {
            const entity = new VoltageTransformerEntity()
            const dataVt: any = await getAssetById(id);
            if (dataVt.success) {
                entity.asset = dataVt.data
                const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date);
                if (dataLifecycleDate.success) {
                    entity.lifecycleDate = dataLifecycleDate.data;
                }


                const dataOldVtInfo: any = await getOldPotentialTransformerInfoById(entity.asset.asset_info);
                if (dataOldVtInfo.success) {
                    entity.OldPotentialTransformerInfo = dataOldVtInfo.data;
                }
                const productAssetModelId = entity.asset.product_asset_model;

                const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId);

                if (dataProductAssetModel.success) {
                    entity.productAssetModel = dataProductAssetModel.data;
                }

                const dataAssetInfo: any = await getAssetInfoById(entity.asset.asset_info);
                if (dataAssetInfo.success) {
                    entity.assetInfo = dataAssetInfo.data;
                }

                const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(entity.asset.mrid, psrId);
                if (dataAssetPsr.success) {
                    entity.assetPsr = dataAssetPsr.data;
                }

                const dataAttachment: any = await getAttachmentByForeignIdAndType(entity.asset.mrid, 'asset');
                if (dataAttachment.success) {
                    entity.attachment = dataAttachment.data;
                }

                const dataVoltage: any = await getVoltageById(entity.OldPotentialTransformerInfo.rated_voltage);
                if (dataVoltage.success) {
                    entity.voltage.push(dataVoltage.data);
                }

                const dataFrequency: any = await getFrequencyById(entity.OldPotentialTransformerInfo.rated_frequency);
                if (dataFrequency.success) {
                    entity.frequency.push(dataFrequency.data);
                }

                const dataPotentialTransformerTable: any = await getPotentialTransformerTableByPotentialTransformerInfoId(entity.OldPotentialTransformerInfo.mrid);
                if (dataPotentialTransformerTable.success) {
                    entity.potentialTransformerTable = dataPotentialTransformerTable.data;
                }

                const arrVoltage: any[] = [];
                const arrApparentPower: any[] = [];
                entity.potentialTransformerTable.forEach((item: any) => {
                    arrVoltage.push(item.usr_rated_voltage);
                    arrApparentPower.push(item.rated_burden);
                })
                const arrVoltageUnique = [...new Set(arrVoltage)];
                const arrApparentPowerUnique = [...new Set(arrApparentPower)];

                for (const voltage of arrVoltageUnique) {
                    const dataVoltage: any = await getVoltageById(voltage);
                    if (dataVoltage.success) {
                        entity.voltage.push(dataVoltage.data);
                    }
                }

                for (const apparentPower of arrApparentPowerUnique) {
                    const dataApparentPower: any = await getApparentPowerById(apparentPower);
                    if (dataApparentPower.success) {
                        entity.apparentPower.push(dataApparentPower.data);
                    }
                }

                return {
                    success: true,
                    data: entity,
                    message: 'Voltage transformer entity retrieved successfully'
                }
            } else {
                return { success: false, error: dataVt.error, message: dataVt.message };
            }
        }
    } catch (error: any) {
        console.error("Error retrieving Voltage Transformer entity by ID:", error);
        return { success: false, error, message: 'Error retrieving Voltage Transformer entity by ID' };
    }
}

export const deleteVoltageTransformerEntity: any = async (data: any) => {
    try {
        if (!data.OldPotentialTransformerInfo || !data.OldPotentialTransformerInfo.mrid) {
            return { success: false, error: new Error('Invalid ID') };
        }

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

            if (data.asset && data.asset.mrid) {
                await deleteAssetByIdTransaction(data.asset.mrid, db);
            }


            await deletePotentialTransformerTableByPotentialTransformerInfoId(data.OldPotentialTransformerInfo.mrid, db);

            if (data.OldPotentialTransformerInfo && data.OldPotentialTransformerInfo.mrid) {
               await deleteOldPotentialTransformerInfoTransaction(data.OldPotentialTransformerInfo.mrid, db);
            }

            if (data.productAssetModel && data.productAssetModel.mrid) {
                await deleteProductAssetModelByIdTransaction(data.productAssetModel.mrid, db);
            }

            if (data.lifecycleDate && data.lifecycleDate.mrid) {
                await deleteLifecycleDateByIdTransaction(data.lifecycleDate.mrid, db);
            }


            const arrVoltage: any[] = [];
            const arrApparentPower: any[] = [];

            if (Array.isArray(data.potentialTransformerTable)) {
                data.potentialTransformerTable.forEach((item: any) => {
                    if (item.usr_rated_voltage) arrVoltage.push(item.usr_rated_voltage);
                    if (item.rated_burden) arrApparentPower.push(item.rated_burden);
                });
            }

            for (const voltage of arrVoltage) {
                if (voltage && voltage.mrid) {
                    await deleteVoltageByIdTransaction(voltage.mrid, db);
                }
            }

            for (const apparentPower of arrApparentPower) {
                if (apparentPower && apparentPower.mrid) {
                    await deleteApparentPowerByIdTransaction(apparentPower.mrid, db);
                }
            }

            if (data.OldPotentialTransformerInfo
                && data.OldPotentialTransformerInfo.rated_frequency
                && data.OldPotentialTransformerInfo.rated_frequency.mrid) {
                await deleteFrequencyByIdTransaction(data.OldPotentialTransformerInfo.rated_frequency.mrid, db);
            }

            if (Array.isArray(data.voltage)) {
                for (const voltage of data.voltage) {
                    if (voltage && voltage.mrid) {
                        await deleteVoltageByIdTransaction(voltage.mrid, db);
                    }
                }
            }


            await runAsync('COMMIT');

            if (data.asset && data.asset.mrid) {
                deleteDirectory(null, data.asset.mrid);
            }

            return { success: true, message: 'Voltage Transformer entity deleted successfully' };

        } catch (error: any) {
            await runAsync('ROLLBACK');
            console.error('Error deleting Voltage Transformer entity:', error);
            return { success: false, error, message: 'Error deleting Voltage Transformer entity' };
        }

    } catch (error: any) {
        console.error('Error deleting Voltage Transformer entity:', error);
        return { success: false, error, message: 'Error deleting Voltage Transformer entity' };
    }
}


const runAsync: any = (sql: string, params: any[] = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err: any) {
            if (err) reject(err);
            else resolve(undefined);
        });
    });
};