import db from '../../datacontext/index'
import path from 'path'
import * as attachmentContext from '../../attachmentcontext/index'
import {
  uploadAttachmentTransaction,
  backupAllFilesInDir,
  deleteBackupFiles,
  restoreFiles,
  syncFilesWithDeletion,
  getAttachmentByForeignIdAndType,
  deleteAttachmentByIdTransaction,
  deleteDirectory
} from '@/function/entity/attachment'
import {
  insertSurgeArresterTransaction,
  getSurgeArresterById,
  getSurgeArresterByAssetId,
  deleteSurgeArresterTransaction
} from '@/function/cim/surgeArrester'
import {
  insertVoltageTransaction,
  getVoltageById,
  deleteVoltageByIdTransaction
} from '@/function/cim/voltage'
import {
  insertSecondsTransaction,
  getSecondById,
  deleteSecondsByIdTransaction
} from '@/function/cim/seconds'
import {
  insertCurrentFlowTransaction,
  getCurrentFlowById,
  deleteCurrentFlowByIdTransaction
} from '@/function/cim/currentFlow'
import {
  insertLifecycleDateTransaction,
  getLifecycleDateById,
  deleteLifecycleDateByIdTransaction
} from '@/function/cim/lifecycleDate'
import {
  insertProductAssetModelTransaction,
  getProductAssetModelById,
  deleteProductAssetModelByIdTransaction
} from '@/function/cim/productAssetModel'
import {
  insertAssetPsrTransaction,
  getAssetPsrByAssetIdAndPsrId,
  deleteAssetPsrTransaction
} from '@/function/entity/assetPsr'
import {
  insertOldSurgeArresterInfoTransaction,
  getOldSurgeArresterInfoBySurgeArresterId,
  deleteOldSurgeArresterInfoByIdTransaction
} from '@/function/cim/oldSurgeArresterInfo'
import SurgeArresterEntity from '@/views/Flatten/SurgeArrester'

const syncUnit = (newList: any[], oldList: any[], insertFn: any, dbsql: any) => {
  const newIdsLocal: any[] = (newList || []).map((v: any) => v.mrid).filter((id: any) => id)
  void newIdsLocal
  const oldIds: any[] = (oldList || []).map((v: any) => v.mrid).filter((id: any) => id)
  const toAdd = (newList || []).filter((v: any) => v.mrid && !oldIds.includes(v.mrid))
  const toUpdate = (newList || []).filter((v: any) => v.mrid && oldIds.includes(v.mrid))
  for (const item of toAdd) insertFn(item, dbsql)
  for (const item of toUpdate) insertFn(item, dbsql)
}

export const insertSurgeArresterEntity: any = async (old_entity: any, entity: any) => {
  try {
    if (entity.surgeArrester.mrid === null || entity.surgeArrester.mrid === '') {
      return {
        success: false,
        error: new Error('MRID is required for Surge Arrester Entity'),
        message: ''
      }
    } else {
      backupAllFilesInDir(null, null, entity.surgeArrester.mrid)
      const syncResult = syncFilesWithDeletion(
        JSON.parse(entity.attachment.path),
        null,
        entity.surgeArrester.mrid
      )
      if (!syncResult.success) {
        restoreFiles(null, null, entity.surgeArrester.mrid)
        deleteBackupFiles(null, entity.surgeArrester.mrid)
        return {
          success: false,
          error: new Error('MRID is required for Surge Arrester Entity'),
          message: ''
        }
      }
      await runAsync('BEGIN TRANSACTION')

      syncUnit(entity.voltage, old_entity.voltage, insertVoltageTransaction, db)
      syncUnit(entity.seconds, old_entity.seconds, insertSecondsTransaction, db)
      syncUnit(entity.currentFlow, old_entity.currentFlow, insertCurrentFlowTransaction, db)

      await insertLifecycleDateTransaction(entity.lifecycleDate, db)
      await insertProductAssetModelTransaction(entity.productAssetModel, db)
      await insertOldSurgeArresterInfoTransaction(entity.oldSurgeArresterInfo, db)
      await insertSurgeArresterTransaction(entity.surgeArrester, db)
      await insertAssetPsrTransaction(entity.assetPsr, db)

      syncUnit(
        entity.assetInfoUnit,
        old_entity.assetInfoUnit,
        insertOldSurgeArresterInfoTransaction,
        db
      )
      syncUnit(entity.assetUnit, old_entity.assetUnit, insertSurgeArresterTransaction, db)

      if (entity.attachment.id && Array.isArray(JSON.parse(entity.attachment.path))) {
        const pathData = JSON.parse(entity.attachment.path)
        const newPath: any[] = []
        for (let i = 0; i < pathData.length; i++) {
          const namefile = path.basename(pathData[i].path)
          pathData[i].path = path.join(
            attachmentContext.getAttachmentDir(),
            entity.surgeArrester.mrid,
            namefile
          )
          newPath.push(pathData[i])
        }
        entity.attachment.path = JSON.stringify(newPath)
        await uploadAttachmentTransaction(entity.attachment, db)
      }

      await runAsync('COMMIT')
      deleteBackupFiles(null, entity.surgeArrester.mrid)
      return { success: true, data: entity, message: 'Surge Arrester entity inserted successfully' }
    }
  } catch (error: any) {
    restoreFiles(null, null, entity.surgeArrester.mrid)
    deleteBackupFiles(null, entity.surgeArrester.mrid)
    console.error('Error retrieving surge arrester entity:', error)
    await runAsync('ROLLBACK')
    return { success: false, error, message: 'Error retrieving surge arrester entity' }
  }
}

export const insertSurgeArresterLiteEntity: any = async (
  entity: any,
  old_entity: any,
  dbsql: any
) => {
  try {
    if (entity.surgeArrester.mrid === null || entity.surgeArrester.mrid === '') {
      return {
        success: false,
        error: new Error('MRID is required for Surge Arrester Entity'),
        message: ''
      }
    } else {
      syncUnit(entity.voltage, old_entity.voltage, insertVoltageTransaction, dbsql)
      syncUnit(entity.seconds, old_entity.seconds, insertSecondsTransaction, dbsql)
      syncUnit(entity.currentFlow, old_entity.currentFlow, insertCurrentFlowTransaction, dbsql)

      await insertLifecycleDateTransaction(entity.lifecycleDate, dbsql)
      await insertProductAssetModelTransaction(entity.productAssetModel, dbsql)
      await insertOldSurgeArresterInfoTransaction(entity.oldSurgeArresterInfo, dbsql)
      await insertSurgeArresterTransaction(entity.surgeArrester, dbsql)

      syncUnit(
        entity.assetInfoUnit,
        old_entity.assetInfoUnit,
        insertOldSurgeArresterInfoTransaction,
        dbsql
      )
      syncUnit(entity.assetUnit, old_entity.assetUnit, insertSurgeArresterTransaction, dbsql)

      return { success: true, data: entity, message: 'Surge Arrester entity inserted successfully' }
    }
  } catch (error: any) {
    console.error('Error retrieving surge arrester entity:', error)
    throw error
  }
}

export const getSurgeArresterEntityById: any = async (id: string, psrId: string) => {
  try {
    if (id == null || id === '') {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      const entity = new SurgeArresterEntity()
      const dataSurgeArrester: any = await getSurgeArresterById(id)
      if (dataSurgeArrester.success) {
        entity.surgeArrester = dataSurgeArrester.data
        const dataLifecycleDate: any = await getLifecycleDateById(
          entity.surgeArrester.lifecycle_date
        )
        if (dataLifecycleDate.success) {
          entity.lifecycleDate = dataLifecycleDate.data
        }
        const dataOldSurgeArresterInfo: any = await getOldSurgeArresterInfoBySurgeArresterId(
          entity.surgeArrester.mrid
        )
        if (dataOldSurgeArresterInfo.success) {
          entity.oldSurgeArresterInfo = dataOldSurgeArresterInfo.data
        }

        const productAssetModelId = entity.oldSurgeArresterInfo.product_asset_model
        const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId)
        if (dataProductAssetModel.success) {
          entity.productAssetModel = dataProductAssetModel.data
        }

        const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(
          entity.surgeArrester.mrid,
          psrId
        )
        if (dataAssetPsr.success) {
          entity.assetPsr = dataAssetPsr.data
        }

        const dataAssetUnit: any = await getSurgeArresterByAssetId(entity.surgeArrester.mrid)
        if (dataAssetUnit.success) {
          entity.assetUnit = dataAssetUnit.data
        }

        for (const assetUnit of entity.assetUnit) {
          const dataAssetInfoUnit: any = await getOldSurgeArresterInfoBySurgeArresterId(
            assetUnit.mrid
          )
          if (dataAssetInfoUnit.success) {
            entity.assetInfoUnit.push(dataAssetInfoUnit.data)
          }
        }

        if (entity.assetInfoUnit.length > 0) {
          const voltageArr = [
            'continuous_operating_voltage',
            'rated_voltage',
            'maximum_system_voltage',
            'pf_with_stand_voltage_isolated_distance',
            'pf_with_stand_voltage_earth_between_pole'
          ]
          const currentFlowArr = ['short_time_with_stand_current']
          const secondsArr = ['rated_duration_of_short_circuit']
          for (let i = 0; i < entity.assetInfoUnit.length; i++) {
            for (let j = 0; j < voltageArr.length; j++) {
              const voltage: any = await getVoltageById(entity.assetInfoUnit[i][voltageArr[j]])
              if (voltage.success) {
                entity.voltage.push(voltage.data)
              }
            }
            for (let j = 0; j < currentFlowArr.length; j++) {
              const currentFlow: any = await getCurrentFlowById(
                entity.assetInfoUnit[i][currentFlowArr[j]]
              )
              if (currentFlow.success) {
                entity.currentFlow.push(currentFlow.data)
              }
            }
            for (let j = 0; j < secondsArr.length; j++) {
              const seconds: any = await getSecondById(entity.assetInfoUnit[i][secondsArr[j]])
              if (seconds.success) {
                entity.seconds.push(seconds.data)
              }
            }
          }
        }

        const dataAttachment: any = await getAttachmentByForeignIdAndType(
          entity.surgeArrester.mrid,
          'asset'
        )
        if (dataAttachment.success) {
          entity.attachment = dataAttachment.data
        }

        return {
          success: true,
          data: entity,
          message: 'Surge Arrester entity retrieved successfully'
        }
      } else {
        return {
          success: false,
          error: dataSurgeArrester.error,
          message: dataSurgeArrester.message
        }
      }
    }
  } catch (error: any) {
    console.error('Error retrieving Surge Arrester entity by ID:', error)
    return { success: false, error, message: 'Error retrieving Surge Arrester entity by ID' }
  }
}

export const getSurgeArresterLiteEntityById: any = async (id: string) => {
  try {
    if (id == null || id === '') {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      const entity = new SurgeArresterEntity()
      const dataSurgeArrester: any = await getSurgeArresterById(id)
      if (dataSurgeArrester.success) {
        entity.surgeArrester = dataSurgeArrester.data
        const dataLifecycleDate: any = await getLifecycleDateById(
          entity.surgeArrester.lifecycle_date
        )
        if (dataLifecycleDate.success) {
          entity.lifecycleDate = dataLifecycleDate.data
        }
        const dataOldSurgeArresterInfo: any = await getOldSurgeArresterInfoBySurgeArresterId(
          entity.surgeArrester.mrid
        )
        if (dataOldSurgeArresterInfo.success) {
          entity.oldSurgeArresterInfo = dataOldSurgeArresterInfo.data
        }

        const productAssetModelId = entity.oldSurgeArresterInfo.product_asset_model
        const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId)
        if (dataProductAssetModel.success) {
          entity.productAssetModel = dataProductAssetModel.data
        }

        const dataAssetUnit: any = await getSurgeArresterByAssetId(entity.surgeArrester.mrid)
        if (dataAssetUnit.success) {
          entity.assetUnit = dataAssetUnit.data
        }

        for (const assetUnit of entity.assetUnit) {
          const dataAssetInfoUnit: any = await getOldSurgeArresterInfoBySurgeArresterId(
            assetUnit.mrid
          )
          if (dataAssetInfoUnit.success) {
            entity.assetInfoUnit.push(dataAssetInfoUnit.data)
          }
        }

        if (entity.assetInfoUnit.length > 0) {
          const voltageArr = [
            'continuous_operating_voltage',
            'rated_voltage',
            'maximum_system_voltage',
            'pf_with_stand_voltage_isolated_distance',
            'pf_with_stand_voltage_earth_between_pole',
            'voltage_ll',
            'voltage_ln'
          ]
          const currentFlowArr = ['short_time_with_stand_current']
          const secondsArr = ['rated_duration_of_short_circuit']
          for (let i = 0; i < entity.assetInfoUnit.length; i++) {
            for (let j = 0; j < voltageArr.length; j++) {
              const voltage: any = await getVoltageById(entity.assetInfoUnit[i][voltageArr[j]])
              if (voltage.success) {
                entity.voltage.push(voltage.data)
              }
            }
            for (let j = 0; j < currentFlowArr.length; j++) {
              const currentFlow: any = await getCurrentFlowById(
                entity.assetInfoUnit[i][currentFlowArr[j]]
              )
              if (currentFlow.success) {
                entity.currentFlow.push(currentFlow.data)
              }
            }
            for (let j = 0; j < secondsArr.length; j++) {
              const seconds: any = await getSecondById(entity.assetInfoUnit[i][secondsArr[j]])
              if (seconds.success) {
                entity.seconds.push(seconds.data)
              }
            }
          }
        }

        return {
          success: true,
          data: entity,
          message: 'Surge Arrester entity retrieved successfully'
        }
      } else {
        return {
          success: false,
          error: dataSurgeArrester.error,
          message: dataSurgeArrester.message
        }
      }
    }
  } catch (error: any) {
    console.error('Error retrieving Surge Arrester entity by ID:', error)
    return { success: false, error, message: 'Error retrieving Surge Arrester entity by ID' }
  }
}

export const deleteSurgeArresterEntity: any = async (data: any) => {
  try {
    if (
      data.surgeArrester == null ||
      data.surgeArrester.mrid == null ||
      data.surgeArrester.mrid === ''
    ) {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      try {
        await runAsync('BEGIN TRANSACTION')
        if (data.attachment && data.attachment.id) {
          const pathData = JSON.parse(data.attachment.path || '[]')
          if (Array.isArray(pathData) && pathData.length > 0) {
            syncFilesWithDeletion(pathData, null, data.mrid)
          }
        }
        if (data.attachment.id) {
          await deleteAttachmentByIdTransaction(data.attachment.id, db)
        }
        if (data.assetPsr && data.assetPsr.mrid) {
          await deleteAssetPsrTransaction(data.assetPsr.mrid, db)
        }
        for (const assetUnit of data.assetUnit) {
          if (assetUnit.mrid) {
            await deleteSurgeArresterTransaction(assetUnit.mrid, db)
          }
        }
        for (const assetInfoUnit of data.assetInfoUnit) {
          if (assetInfoUnit.mrid) {
            await deleteOldSurgeArresterInfoByIdTransaction(assetInfoUnit.mrid, db)
          }
        }
        if (data.surgeArrester.mrid) {
          await deleteSurgeArresterTransaction(data.surgeArrester.mrid, db)
        }
        if (data.oldSurgeArresterInfo.mrid) {
          await deleteOldSurgeArresterInfoByIdTransaction(data.oldSurgeArresterInfo.mrid, db)
        }
        if (data.lifecycleDate && data.lifecycleDate.mrid) {
          await deleteLifecycleDateByIdTransaction(data.lifecycleDate.mrid, db)
        }
        if (data.productAssetModel && data.productAssetModel.mrid) {
          await deleteProductAssetModelByIdTransaction(data.productAssetModel.mrid, db)
        }
        for (const voltage of data.voltage) {
          if (voltage.mrid) {
            await deleteVoltageByIdTransaction(voltage.mrid, db)
          }
        }
        for (const seconds of data.seconds) {
          if (seconds.mrid) {
            await deleteSecondsByIdTransaction(seconds.mrid, db)
          }
        }
        for (const currentFlow of data.currentFlow) {
          if (currentFlow.mrid) {
            await deleteCurrentFlowByIdTransaction(currentFlow.mrid, db)
          }
        }
        await runAsync('COMMIT')
        if (data.attachment && data.attachment.id) {
          deleteDirectory(null, data.surgeArrester.mrid)
        }
        return { success: true, message: 'Surge Arrester entity deleted successfully' }
      } catch (error: any) {
        await runAsync('ROLLBACK')
        console.error('Error deleting Surge Arrester entity:', error)
        return { success: false, error, message: 'Error deleting Surge Arrester entity' }
      }
    }
  } catch (error: any) {
    console.error('Error deleting Surge Arrester entity:', error)
    return { success: false, error, message: 'Error deleting Surge Arrester entity' }
  }
}

export const deleteSurgeArresterLiteEntity: any = async (data: any, dbsql: any) => {
  try {
    if (
      data.surgeArrester == null ||
      data.surgeArrester.mrid == null ||
      data.surgeArrester.mrid === ''
    ) {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      for (const assetUnit of data.assetUnit) {
        if (assetUnit.mrid) {
          await deleteSurgeArresterTransaction(assetUnit.mrid, dbsql)
        }
      }
      for (const assetInfoUnit of data.assetInfoUnit) {
        if (assetInfoUnit.mrid) {
          await deleteOldSurgeArresterInfoByIdTransaction(assetInfoUnit.mrid, dbsql)
        }
      }
      if (data.surgeArrester.mrid) {
        await deleteSurgeArresterTransaction(data.surgeArrester.mrid, dbsql)
      }
      if (data.oldSurgeArresterInfo.mrid) {
        await deleteOldSurgeArresterInfoByIdTransaction(data.oldSurgeArresterInfo.mrid, dbsql)
      }
      if (data.lifecycleDate && data.lifecycleDate.mrid) {
        await deleteLifecycleDateByIdTransaction(data.lifecycleDate.mrid, dbsql)
      }
      if (data.productAssetModel && data.productAssetModel.mrid) {
        await deleteProductAssetModelByIdTransaction(data.productAssetModel.mrid, dbsql)
      }
      for (const voltage of data.voltage) {
        if (voltage.mrid) {
          await deleteVoltageByIdTransaction(voltage.mrid, dbsql)
        }
      }
      for (const seconds of data.seconds) {
        if (seconds.mrid) {
          await deleteSecondsByIdTransaction(seconds.mrid, dbsql)
        }
      }
      for (const currentFlow of data.currentFlow) {
        if (currentFlow.mrid) {
          await deleteCurrentFlowByIdTransaction(currentFlow.mrid, dbsql)
        }
      }
      return { success: true, message: 'Surge Arrester entity deleted successfully' }
    }
  } catch (error: any) {
    console.error('Error deleting Surge Arrester entity:', error)
    throw error
  }
}

const runAsync: any = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err: any) {
      if (err) reject(err)
      else resolve(undefined)
    })
  })
}
