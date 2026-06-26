import db from '../../../datacontext/index.js'
import * as attachmentContext from '../../../attachmentcontext/index'
import path from 'path'
import { uploadAttachmentTransaction, deleteAttachmentByIdTransaction, backupAllFilesInDir, deleteBackupFiles, restoreFiles, syncFilesWithDeletion, getAttachmentByForeignIdAndType } from '@/function/entity/attachment'
import {insertOldWorkTransaction, getOldWorkById, deleteOldWorkByIdTransaction} from "@/function/cim/oldWork/index"
import { insertTestingEquipmentTransaction, getTestingEquipmentByWorkId, deleteTestingEquipmentByIdTransaction } from '../../testingEquipment/index.js'
import BushingJobEntity from '@/views/Flatten/Job/VoltageTransformer/index.js'
import { insertWorkTaskTransaction, getWorkTaskByWork, deleteWorkTaskByIdTransaction } from '@/function/cim/workTask/index.js'
import { insertVoltageTransformerTestingEquipmentTestTypeTransaction, getVoltageTransformerTestingEquipmentTestingEqId, deleteVoltageTransformerTestingEquipmentTestTypeByIdTransaction } from '../../voltageTransformerTestingEquipmentTestType/index.js'
import { insertTestDataSetTransaction, getTestDataSetByWorkTaskId, deleteTestDataSetByIdTransaction } from '@/function/cim/testDataSet'
import { insertAnalogValueTransaction, getAnalogValueByTestDataSetMrids, deleteAnalogValueByIdTransaction } from '@/function/cim/analogValue/index.js'
import { insertStringMeasurementValueTransaction, getStringMeasurementValueByTestDataSetMrids, deleteStringMeasurementValueByIdTransaction } from '@/function/cim/stringMeasurementValue/index.js'
import { insertDiscreteValueTransaction, getDiscreteValueByTestDataSetMrids, deleteDiscreteValueByIdTransaction } from '@/function/cim/discreteValue/index.js'
import { insertProcedureDataSetMeasurementValueTransaction } from '@/function/cim/procedureDataSetMeasurementValue/index.js'
import { insertProcedureAssetTransaction } from '@/function/cim/procedureAsset/index.js'

export const insertVoltageTransformerJobEntity: any = async (old_entity: any, entity: any) => {
    try {
        if(entity.oldWork.mrid === null || entity.oldWork.mrid === '') {
            return { success: false, error: new Error("MRID is required for VoltageTransformer Job Entity"), message: '' }
        } else {
            backupAllFilesInDir(null, null, entity.oldWork.mrid);
            const syncResult = syncFilesWithDeletion(JSON.parse(entity.attachment.path), null, entity.oldWork.mrid);
            if (!syncResult.success) {
                restoreFiles(null, null, entity.oldWork.mrid);
                deleteBackupFiles(null, entity.oldWork.mrid);
                return { success: false, error: new Error("MRID is required for VoltageTransformer Job Entity"), message: '' }
            }

            for(const attachment of entity.attachmentTest) {
                if(attachment.id && Array.isArray(JSON.parse(attachment.path))) {
                    backupAllFilesInDir(null, null, attachment.id_foreign);
                    const syncResult = syncFilesWithDeletion(JSON.parse(attachment.path), null, attachment.id_foreign);
                    if (!syncResult.success) {
                        restoreFiles(null, null, attachment.id_foreign);
                        deleteBackupFiles(null, attachment.id_foreign);
                        return { success: false, error: new Error("MRID is required for VoltageTransformer Job Entity"), message: '' }
                    }
                }
            }

            await runAsync('BEGIN TRANSACTION');
            await insertOldWorkTransaction(entity.oldWork, db);
            if (entity.attachment.id && Array.isArray(JSON.parse(entity.attachment.path))) {
                const pathData = JSON.parse(entity.attachment.path);
                const newPath: any[] = []
                for(let i = 0; i < pathData.length; i++) {
                    const namefile = path.basename(pathData[i].path);
                    pathData[i].path = path.join(attachmentContext.getAttachmentDir(), namefile);
                    newPath.push(pathData[i]);
                }
                entity.attachment.path = JSON.stringify(newPath);
                await uploadAttachmentTransaction(entity.attachment, db);
            }

            for(const procedureAsset of entity.procedureAsset) {
                await insertProcedureAssetTransaction(procedureAsset, db);
            }

            const newIds = entity.testingEquipment.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIds = old_entity.testingEquipment.map((v: any) => v.mrid).filter((id: any) => id);
            const toAdd = entity.testingEquipment.filter((v: any) => v.mrid && !oldIds.includes(v.mrid));
            const toDelete = old_entity.testingEquipment.filter((v: any) => v.mrid && !newIds.includes(v.mrid));
            const toUpdate = entity.testingEquipment.filter((v: any) => v.mrid && oldIds.includes(v.mrid));
            for (const equipment of toAdd) {
                await insertTestingEquipmentTransaction(equipment, db);
            }
            for (const equipment of toUpdate) {
                await insertTestingEquipmentTransaction(equipment, db);
            }

            const newIdsSet = entity.voltagetransformerTestingEquipmentTestType.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIdsSet = old_entity.voltagetransformerTestingEquipmentTestType.map((v: any) => v.mrid).filter((id: any) => id);
            const toAddSet = entity.voltagetransformerTestingEquipmentTestType.filter((v: any) => v.mrid && !oldIdsSet.includes(v.mrid));
            const toDeleteSet = old_entity.voltagetransformerTestingEquipmentTestType.filter((v: any) => v.mrid && !newIdsSet.includes(v.mrid));
            const toUpdateSet = entity.voltagetransformerTestingEquipmentTestType.filter((v: any) => v.mrid && oldIdsSet.includes(v.mrid));
            for (const equipmentTestType of toAddSet) {
                await insertVoltageTransformerTestingEquipmentTestTypeTransaction(equipmentTestType, db);
            }
            for (const equipmentTestType of toUpdateSet) {
                await insertVoltageTransformerTestingEquipmentTestTypeTransaction(equipmentTestType, db);
            }

            const newIdsWorkTask = entity.workTasks.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIdsWorkTask = old_entity.workTasks.map((v: any) => v.mrid).filter((id: any) => id);
            const toAddWorkTask = entity.workTasks.filter((v: any) => v.mrid && !oldIdsWorkTask.includes(v.mrid));
            const toDeleteWorkTask = old_entity.workTasks.filter((v: any) => v.mrid && !newIdsWorkTask.includes(v.mrid));
            const toUpdateWorkTask = entity.workTasks.filter((v: any) => v.mrid && oldIdsWorkTask.includes(v.mrid));
            for (const workTask of toAddWorkTask) {
                await insertWorkTaskTransaction(workTask, db);
            }
            for (const workTask of toUpdateWorkTask) {
                await insertWorkTaskTransaction(workTask, db);
            }

            if (entity.attachment.id && Array.isArray(JSON.parse(entity.attachment.path))) {
                const pathData = JSON.parse(entity.attachment.path);
                const newPath: any[] = []
                for(let i = 0; i < pathData.length; i++) {
                    const namefile = path.basename(pathData[i].path);
                    pathData[i].path = path.join(attachmentContext.getAttachmentDir(), entity.attachment.id_foreign, namefile);
                    newPath.push(pathData[i]);
                }
                entity.attachment.path = JSON.stringify(newPath);
                await uploadAttachmentTransaction(entity.attachment, db);
            }

            for(const attachment of entity.attachmentTest) {
                if (attachment.id && Array.isArray(JSON.parse(attachment.path))) {
                    const pathData = JSON.parse(attachment.path);
                    const newPath: any[] = []
                    for(let i = 0; i < pathData.length; i++) {
                        const namefile = path.basename(pathData[i].path);
                        pathData[i].path = path.join(attachmentContext.getAttachmentDir(), attachment.id_foreign, namefile);
                        newPath.push(pathData[i]);
                    }
                    attachment.path = JSON.stringify(newPath);
                    await uploadAttachmentTransaction(attachment, db);
                }
            }

            const newIdsTestDataSet = entity.testDataSet.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIdsTestDataSet = old_entity.testDataSet.map((v: any) => v.mrid).filter((id: any) => id);
            const toAddTestDataSet = entity.testDataSet.filter((v: any) => v.mrid && !oldIdsTestDataSet.includes(v.mrid));
            const toUpdateTestDataSet = entity.testDataSet.filter((v: any) => v.mrid && oldIdsTestDataSet.includes(v.mrid));
            const toDeleteTestDataSet = old_entity.testDataSet.filter((v: any) => v.mrid && !newIdsTestDataSet.includes(v.mrid));
            for (const testData of toAddTestDataSet) {
                await insertTestDataSetTransaction(testData, db);
            }
            for (const testData of toUpdateTestDataSet) {
                await insertTestDataSetTransaction(testData, db);
            }

            const newIdsAnalogValue = entity.analogValues.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIdsAnalogValue = old_entity.analogValues.map((v: any) => v.mrid).filter((id: any) => id);
            const toAddAnalogValue = entity.analogValues.filter((v: any) => v.mrid && !oldIdsAnalogValue.includes(v.mrid));
            const toUpdateAnalogValue = entity.analogValues.filter((v: any) => v.mrid && oldIdsAnalogValue.includes(v.mrid));
            const toDeleteAnalogValue = old_entity.analogValues.filter((v: any) => v.mrid && !newIdsAnalogValue.includes(v.mrid));
            for (const analogValue of toAddAnalogValue) {
                await insertAnalogValueTransaction(analogValue, db);
            }
            for (const analogValue of toUpdateAnalogValue) {
                await insertAnalogValueTransaction(analogValue, db);
            }

            const newIdsStringMeasurementValue = entity.stringMeasurementValues.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIdsStringMeasurementValue = old_entity.stringMeasurementValues.map((v: any) => v.mrid).filter((id: any) => id);
            const toAddStringMeasurementValue = entity.stringMeasurementValues.filter((v: any) => v.mrid && !oldIdsStringMeasurementValue.includes(v.mrid));
            const toUpdateStringMeasurementValue = entity.stringMeasurementValues.filter((v: any) => v.mrid && oldIdsStringMeasurementValue.includes(v.mrid));
            const toDeleteStringMeasurementValue = old_entity.stringMeasurementValues.filter((v: any) => v.mrid && !newIdsStringMeasurementValue.includes(v.mrid));
            for (const stringMeasurementValue of toAddStringMeasurementValue) {
                await insertStringMeasurementValueTransaction(stringMeasurementValue, db);
            }
            for (const stringMeasurementValue of toUpdateStringMeasurementValue) {
                await insertStringMeasurementValueTransaction(stringMeasurementValue, db);
            }

            const newIdsDiscreteValue = entity.discreteValues.map((v: any) => v.mrid).filter((id: any) => id);
            const oldIdsDiscreteValue = old_entity.discreteValues.map((v: any) => v.mrid).filter((id: any) => id);
            const toAddDiscreteValue = entity.discreteValues.filter((v: any) => v.mrid && !oldIdsDiscreteValue.includes(v.mrid));
            const toUpdateDiscreteValue = entity.discreteValues.filter((v: any) => v.mrid && oldIdsDiscreteValue.includes(v.mrid));
            const toDeleteDiscreteValue = old_entity.discreteValues.filter((v: any) => v.mrid && !newIdsDiscreteValue.includes(v.mrid));
            for (const discreteValue of toAddDiscreteValue) {
                await insertDiscreteValueTransaction(discreteValue, db);
            }
            for (const discreteValue of toUpdateDiscreteValue) {
                await insertDiscreteValueTransaction(discreteValue, db);
            }

            for(const procedureDataSetMeasurementValue of entity.procedureDataSetMeasurementValue) {
                await insertProcedureDataSetMeasurementValueTransaction(procedureDataSetMeasurementValue, db);
            }

            for(const analogValue of toDeleteAnalogValue) {
                await deleteAnalogValueByIdTransaction(analogValue.mrid, db);
            }
            for(const stringMeasurementValue of toDeleteStringMeasurementValue) {
                await deleteStringMeasurementValueByIdTransaction(stringMeasurementValue.mrid, db);
            }
            for(const discreteValue of toDeleteDiscreteValue) {
                await deleteDiscreteValueByIdTransaction(discreteValue.mrid, db);
            }
            for (const testData of toDeleteTestDataSet) {
                await deleteTestDataSetByIdTransaction(testData.mrid, db);
            }
            for(const equipmentTestType of toDeleteSet) {
                await deleteVoltageTransformerTestingEquipmentTestTypeByIdTransaction(equipmentTestType.mrid, db);
            }
            for (const equipment of toDelete) {
                await deleteTestingEquipmentByIdTransaction(equipment.mrid, db);
            }
            for (const workTask of toDeleteWorkTask) {
                await deleteWorkTaskByIdTransaction(workTask.mrid, db);
            }

            await runAsync('COMMIT');
            deleteBackupFiles(null, entity.oldWork.mrid);
            for(const attachment of entity.attachmentTest) {
                deleteBackupFiles(null, attachment.id_foreign);
            }
            return { success: true, data: entity, message: 'VoltageTransformer Job entity inserted successfully' }
        }
    } catch (error: any) {
        await runAsync('ROLLBACK');
        console.error('Error retrieving bushing entity:', error);
        restoreFiles(null, null, entity.oldWork.mrid);
        deleteBackupFiles(null, entity.oldWork.mrid);
        for(const attachment of entity.attachmentTest) {
            restoreFiles(null, null, attachment.id_foreign);
            deleteBackupFiles(null, attachment.id_foreign);
        }
        return { success: false, error, message: 'Error retrieving bushing entity' };
    }
}

export const getVoltageTransformerJobEntity: any = async (id: string) => {
    try {
        if(id == null || id === '') {
            return { success: false, error: new Error('Invalid ID') };
        } else {
            const entity = new BushingJobEntity()
            const dataOldWork: any = await getOldWorkById(id);
            if(dataOldWork.success) {
                entity.oldWork = dataOldWork.data;
                const dataAttachment: any = await getAttachmentByForeignIdAndType(entity.oldWork.mrid, 'job');
                if(dataAttachment.success) entity.attachment = dataAttachment.data;
                const dataTestingEquipment: any = await getTestingEquipmentByWorkId(entity.oldWork.mrid);
                if(dataTestingEquipment.success) entity.testingEquipment = dataTestingEquipment.data;
                else entity.testingEquipment = [];
                for(const equipment of entity.testingEquipment) {
                    const dataEquipmentTestType: any = await getVoltageTransformerTestingEquipmentTestingEqId(equipment.mrid);
                    if(dataEquipmentTestType.success) entity.voltagetransformerTestingEquipmentTestType = entity.voltagetransformerTestingEquipmentTestType.concat(dataEquipmentTestType.data);
                }
                const dataWorkTask: any = await getWorkTaskByWork(entity.oldWork.mrid, db);
                if(dataWorkTask.success) entity.workTasks = dataWorkTask.data;
                else entity.workTasks = [];
                for (let i = 0; i < entity.workTasks.length; i++) {
                    const workTask = entity.workTasks[i];
                    const dataAttachmentTest: any = await getAttachmentByForeignIdAndType(workTask.mrid, 'test');
                    if(dataAttachmentTest.success) entity.attachmentTest.push(dataAttachmentTest.data);
                    const dataTestDataSet: any = await getTestDataSetByWorkTaskId(workTask.mrid)
                    if(dataTestDataSet.success) entity.testDataSet = entity.testDataSet.concat(dataTestDataSet.data)
                }
                const mrids: any[] = entity.testDataSet.map((x: any) => x.mrid);
                const analogValue: any = await getAnalogValueByTestDataSetMrids(mrids);
                if(analogValue.success) entity.analogValues = analogValue.data;
                const stringMeasurementValue: any = await getStringMeasurementValueByTestDataSetMrids(mrids);
                if(stringMeasurementValue.success) entity.stringMeasurementValues = stringMeasurementValue.data;
                const discreteValue: any = await getDiscreteValueByTestDataSetMrids(mrids);
                if(discreteValue.success) entity.discreteValues = discreteValue.data;
                return { success: true, data: entity, message: 'voltagetransformer job entity retrieved successfully' }
            } else {
                return { success: false, error: dataOldWork.error, message: 'Error retrieving old work data' };
            }
        }
    } catch (error: any) {
        console.error('Error retrieving bushing job entity:', error);
        return { success: false, error, message: 'Error retrieving bushing job entity' };
    }
}

export const deleteVoltageTransformerJobEntity: any = async (entity: any) => {
    try {
        await runAsync('BEGIN TRANSACTION');
        if (entity.analogValues && entity.analogValues.length > 0) {
            for (const item of entity.analogValues) {
                await deleteAnalogValueByIdTransaction(item.mrid, db);
            }
        }
        if (entity.stringMeasurementValues && entity.stringMeasurementValues.length > 0) {
            for (const item of entity.stringMeasurementValues) {
                await deleteStringMeasurementValueByIdTransaction(item.mrid, db);
            }
        }
        if (entity.discreteValues && entity.discreteValues.length > 0) {
            for (const item of entity.discreteValues) {
                await deleteDiscreteValueByIdTransaction(item.mrid, db);
            }
        }
        if (entity.testDataSet && entity.testDataSet.length > 0) {
            for (const item of entity.testDataSet) {
                await deleteTestDataSetByIdTransaction(item.mrid, db);
            }
        }
        if (entity.voltagetransformerTestingEquipmentTestType && entity.voltagetransformerTestingEquipmentTestType.length > 0) {
            for (const item of entity.voltagetransformerTestingEquipmentTestType) {
                await deleteVoltageTransformerTestingEquipmentTestTypeByIdTransaction(item.mrid, db);
            }
        }
        if (entity.testingEquipment && entity.testingEquipment.length > 0) {
            for (const item of entity.testingEquipment) {
                await deleteTestingEquipmentByIdTransaction(item.mrid, db);
            }
        }
        if (entity.workTasks && entity.workTasks.length > 0) {
            for (const item of entity.workTasks) {
                await deleteWorkTaskByIdTransaction(item.mrid, db);
            }
        }
        if (entity.attachment && entity.attachment.id) {
            await deleteAttachmentByIdTransaction(entity.attachment.id, db);
        }
        if (entity.attachmentTest && entity.attachmentTest.length > 0) {
            for (const attachment of entity.attachmentTest) {
                if (attachment.id) {
                    await deleteAttachmentByIdTransaction(attachment.id, db)
                }
            }
        }
        if (entity.oldWork && entity.oldWork.mrid) {
            await deleteOldWorkByIdTransaction(entity.oldWork.mrid, db);
        }
        await runAsync('COMMIT');
        if (entity.attachment && entity.attachment.path) {
            const pathData = JSON.parse(entity.attachment.path || '[]');
            if (Array.isArray(pathData) && pathData.length > 0) {
                syncFilesWithDeletion(pathData, null, entity.oldWork.mrid);
            }
        }
        if (entity.attachmentTest && entity.attachmentTest.length > 0) {
            for (const attachment of entity.attachmentTest) {
                if (attachment.path) {
                    const pathData = JSON.parse(attachment.path || '[]');
                    if (Array.isArray(pathData) && pathData.length > 0) {
                        syncFilesWithDeletion(pathData, null, attachment.id_foreign);
                    }
                }
            }
        }
        return { success: true, message: 'VoltageTransformer Job entity deleted successfully' };
    } catch (error: any) {
        await runAsync('ROLLBACK');
        console.error('Delete VoltageTransformer Job Error:', error);
        return { success: false, error, message: 'Error deleting VoltageTransformer Job entity' };
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