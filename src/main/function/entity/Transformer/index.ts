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
  insertOldPowerTransformerInfoTransaction,
  getOldPowerTransformerInfoById,
  deleteOldPowerTransformerInfoTransaction
} from '@/function/cim/oldPowerTransformerInfo'
import {
  insertOldTransformerEndInfoTransaction,
  deleteOldTransformerEndInfoTransaction,
  getOldTransformerEndInfoByPowerTransformerInfoId
} from '@/function/cim/oldTransformerEndInfo'
import {
  insertOtherTransaction,
  getOtherByPowerTransformerInfoId,
  deleteOtherByIdTransaction
} from '@/function/cim/other'
import {
  insertAssetPsrTransaction,
  getAssetPsrByAssetIdAndPsrId,
  deleteAssetPsrTransaction
} from '@/function/entity/assetPsr'
import {
  insertProductAssetModelTransaction,
  getProductAssetModelById,
  deleteProductAssetModelByIdTransaction
} from '@/function/cim/productAssetModel'
import {
  insertLifecycleDateTransaction,
  getLifecycleDateById,
  deleteLifecycleDateByIdTransaction
} from '@/function/cim/lifecycleDate'
import {
  insertSecondsTransaction,
  deleteSecondsByIdTransaction,
  getSecondByIds
} from '@/function/cim/seconds'
import {
  insertCurrentFlowTransaction,
  deleteCurrentFlowByIdTransaction,
  getCurrentFlowByIds
} from '@/function/cim/currentFlow'
import {
  insertVoltageTransaction,
  deleteVoltageByIdTransaction,
  getVoltageByIds
} from '@/function/cim/voltage'
import {
  insertPercentTransaction,
  getPercentByIds,
  deletePercentByIdTransaction
} from '@/function/cim/percent'
import {
  insertActivePowerTransaction,
  getActivePowerByIds,
  deleteActivePowerByIdTransaction
} from '@/function/cim/activePower'
import {
  insertApparentPowerTransaction,
  getApparentPowerByIds,
  deleteApparentPowerByIdTransaction
} from '@/function/cim/apparentPower'
import {
  insertFrequencyTransaction,
  deleteFrequencyByIdTransaction,
  getFrequencyByIds
} from '@/function/cim/frequency'
import { insertMassTransaction, deleteMassByIdTransaction, getMassByIds } from '@/function/cim/mass'
import {
  insertVolumeTransaction,
  deleteVolumeByIdTransaction,
  getVolumeByIds
} from '@/function/cim/volume'
import {
  insertTemperatureTransaction,
  deleteTemperatureByIdTransaction,
  getTemperatureByIds
} from '@/function/cim/temperature'
import {
  insertAssetTransaction,
  getAssetByAssetInfoId,
  deleteAssetByIdTransaction,
  getAssetById
} from '@/function/cim/asset'
import {
  insertZeroSequenceImpedanceTransaction,
  deleteZeroSequenceImpedanceTransaction,
  getZeroSequenceImpedanceByTransformerInfoId
} from '@/function/cim/zeroSequenceImpedance'
import {
  insertZeroSequenceImpedanceTableTransaction,
  getZeroSequenceImpedanceTableByZeroSequenceImpedanceId,
  deleteZeroSequenceImpedanceTableTransaction
} from '@/function/cim/zeroSequenceImpedanceTable'
import {
  insertVoltageRatingTransaction,
  deleteVoltageRatingTransaction,
  getVoltageRatingByTransformerEndId
} from '@/function/cim/voltageRating'
import {
  insertCoolingPowerRatingTransaction,
  getCoolingPowerRatingByPowerTransformerInfoId,
  deleteCoolingPowerRatingTransaction
} from '@/function/cim/coolingPowerRating'
import {
  insertCurrentRatingTransaction,
  getCurrentRatingByRatedPower,
  deleteCurrentRatingByIdTransaction
} from '@/function/cim/currentRating'
import {
  insertBaseVoltageTransaction,
  deleteBaseVoltageByIdTransaction,
  getBaseVoltageByIds
} from '@/function/cim/baseVoltage'
import {
  insertBasePowerTransaction,
  deleteBasePowerByIdTransaction,
  getBasePowerByIds
} from '@/function/cim/basePower'
import {
  insertShortCircuitTestTransaction,
  getShortCircuitTestByTransformerEndInfoId,
  deleteShortCircuitTestByIdTransaction
} from '@/function/cim/shortCircuitTest'
import {
  insertSCTTransformerEndInfoTransaction,
  getSCTTransformerEndInfoByShortCircuitTestId,
  deleteSCTTransformerEndInfoByIdTransaction
} from '@/function/cim/shortCircuitTestTransformerEndInfo'
import {
  insertShortCircuitRatingTransaction,
  deleteShortCircuitRatingByIdTransaction,
  getShortCircuitRatingByPowerTransformerInfoId
} from '@/function/cim/shortCircuitRating'
import {
  insertOldTapChangerInfoTransaction,
  getOldTapChangerInfoByPowerTransformerInfoId,
  deleteOldTapChangerInfoTransaction
} from '@/function/cim/oldTapChangerInfo'
import {
  insertTapChangerTablePointTransaction,
  getTapChangerTablePointByTapChangerInfoId,
  deleteTapChangerTablePointTransaction
} from '@/function/cim/tapChangerTablePoint'
import {
  insertSurgeArresterLiteEntity,
  deleteSurgeArresterLiteEntity,
  getSurgeArresterLiteEntityById
} from '@/function/entity/surgeArrester'
import { getSurgeArresterByAssetId } from '@/function/cim/surgeArrester'
import { getOldBushingInfoByTransformerEndInfoIds } from '@/function/cim/oldBushingInfo'
import TransformerEntity from '@/views/Flatten/Transformer/index'
import SurgeArrester from '@/views/Flatten/SurgeArrester'
import * as bushingFunc from '../Bushing/index'

const isUsedInTable: any = async (table: string, column: string, id: string, db: any) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT 1 FROM ${table} WHERE ${column} = ?`, [id], (err: any, row: any) => {
      if (err) reject(err)
      else resolve(!!row)
    })
  })
}

const tryDelete: any = async (deleteFunc: any, id: string, dbsql: any, name: string) => {
  try {
    await deleteFunc(id, dbsql)
  } catch (error: any) {
    const sqlError = error.err || error
    if (sqlError && sqlError.code === 'SQLITE_CONSTRAINT') {
      console.warn(`Skipping delete ${name} (${id}): Used by other entities.`)
    } else {
      throw error
    }
  }
}

const insertUnit: any = async (unit: string, data: any, dbsql: any) => {
  if (unit == 'voltage') {
    await insertVoltageTransaction(data, dbsql)
  } else if (unit == 'currentFlow') {
    await insertCurrentFlowTransaction(data, dbsql)
  } else if (unit == 'seconds') {
    await insertSecondsTransaction(data, dbsql)
  } else if (unit == 'activePower') {
    await insertActivePowerTransaction(data, dbsql)
  } else if (unit == 'apparentPower') {
    await insertApparentPowerTransaction(data, dbsql)
  } else if (unit == 'mass') {
    await insertMassTransaction(data, dbsql)
  } else if (unit == 'volume') {
    await insertVolumeTransaction(data, dbsql)
  } else if (unit == 'temperature') {
    await insertTemperatureTransaction(data, dbsql)
  } else if (unit == 'frequency') {
    await insertFrequencyTransaction(data, dbsql)
  } else if (unit == 'baseVoltage') {
    await insertBaseVoltageTransaction(data, dbsql)
  } else if (unit == 'basePower') {
    await insertBasePowerTransaction(data, dbsql)
  } else if (unit == 'percent') {
    await insertPercentTransaction(data, dbsql)
  }
}

const deleteUnit: any = async (unit: string, data: any, dbsql: any) => {
  if (unit == 'voltage') {
    await deleteVoltageByIdTransaction(data, dbsql)
  } else if (unit == 'currentFlow') {
    await deleteCurrentFlowByIdTransaction(data, dbsql)
  } else if (unit == 'seconds') {
    await deleteSecondsByIdTransaction(data, dbsql)
  } else if (unit == 'activePower') {
    await deleteActivePowerByIdTransaction(data, dbsql)
  } else if (unit == 'apparentPower') {
    await deleteApparentPowerByIdTransaction(data, dbsql)
  } else if (unit == 'mass') {
    await deleteMassByIdTransaction(data, dbsql)
  } else if (unit == 'volume') {
    await deleteVolumeByIdTransaction(data, dbsql)
  } else if (unit == 'temperature') {
    await deleteTemperatureByIdTransaction(data, dbsql)
  } else if (unit == 'frequency') {
    await deleteFrequencyByIdTransaction(data, dbsql)
  } else if (unit == 'baseVoltage') {
    await deleteBaseVoltageByIdTransaction(data, dbsql)
  } else if (unit == 'basePower') {
    await deleteBasePowerByIdTransaction(data, dbsql)
  } else if (unit == 'percent') {
    await deletePercentByIdTransaction(data, dbsql)
  }
}

const insertTable: any = async (table: string, data: any, dbsql: any) => {
  if (table == 'oldTransformerEndInfo') {
    await insertOldTransformerEndInfoTransaction(data, dbsql)
  } else if (table == 'voltageRating') {
    await insertVoltageRatingTransaction(data, dbsql)
  } else if (table == 'coolingPowerRating') {
    await insertCoolingPowerRatingTransaction(data, dbsql)
  } else if (table == 'currentRating') {
    await insertCurrentRatingTransaction(data, dbsql)
  } else if (table == 'shortCircuitTest') {
    await insertShortCircuitTestTransaction(data, dbsql)
  } else if (table == 'shortCircuitTestTransformerEndInfo') {
    await insertSCTTransformerEndInfoTransaction(data, dbsql)
  } else if (table == 'zeroSequenceImpedanceTable') {
    await insertZeroSequenceImpedanceTableTransaction(data, dbsql)
  }
}

const deleteTable: any = async (table: string, data: any, dbsql: any) => {
  if (table == 'oldTransformerEndInfo') {
    await deleteOldTransformerEndInfoTransaction(data, dbsql)
  } else if (table == 'voltageRating') {
    await deleteVoltageRatingTransaction(data, dbsql)
  } else if (table == 'coolingPowerRating') {
    await deleteCoolingPowerRatingTransaction(data, dbsql)
  } else if (table == 'currentRating') {
    await deleteCurrentRatingByIdTransaction(data, dbsql)
  } else if (table == 'shortCircuitTest') {
    await deleteShortCircuitTestByIdTransaction(data, dbsql)
  } else if (table == 'shortCircuitTestTransformerEndInfo') {
    await deleteSCTTransformerEndInfoByIdTransaction(data, dbsql)
  } else if (table == 'zeroSequenceImpedanceTable') {
    await deleteZeroSequenceImpedanceTableTransaction(data, dbsql)
  }
}

export const insertTransformerEntity: any = async (old_entity: any, entity: any) => {
  const unitTypes = [
    'percent',
    'voltage',
    'currentFlow',
    'seconds',
    'activePower',
    'apparentPower',
    'mass',
    'volume',
    'temperature',
    'frequency',
    'baseVoltage',
    'basePower'
  ]
  const tableTypes = [
    'oldTransformerEndInfo',
    'voltageRating',
    'coolingPowerRating',
    'currentRating',
    'shortCircuitTest',
    'shortCircuitTestTransformerEndInfo',
    'zeroSequenceImpedanceTable'
  ]
  try {
    if (entity.asset.mrid === null || entity.asset.mrid === '') {
      return {
        success: false,
        error: new Error('MRID is required for Transformer Entity'),
        message: ''
      }
    } else {
      backupAllFilesInDir(null, null, entity.asset.mrid)
      const syncResult = syncFilesWithDeletion(
        JSON.parse(entity.attachment.path),
        null,
        entity.asset.mrid
      )
      if (!syncResult.success) {
        restoreFiles(null, null, entity.asset.mrid)
        return {
          success: false,
          error: new Error('MRID is required for Transformer Entity'),
          message: ''
        }
      }
      await runAsync('BEGIN TRANSACTION')
      const toDeleteUnit: any = {}
      for (const unitType of unitTypes) {
        const newIds = entity[unitType].map((v: any) => v.mrid).filter((id: any) => id)
        const oldIds = old_entity[unitType].map((v: any) => v.mrid).filter((id: any) => id)

        const toAdd = entity[unitType].filter((v: any) => v.mrid && !oldIds.includes(v.mrid))
        toDeleteUnit[unitType] = old_entity[unitType].filter(
          (v: any) => v.mrid && !newIds.includes(v.mrid)
        )
        const toUpdate = entity[unitType].filter((v: any) => v.mrid && oldIds.includes(v.mrid))
        for (const unit of toAdd) {
          await insertUnit(unitType, unit, db)
        }
        for (const unit of toUpdate) {
          await insertUnit(unitType, unit, db)
        }
      }
      await insertOldPowerTransformerInfoTransaction(entity.oldPowerTransformerInfo, db)
      await insertOtherTransaction(entity.other, db)
      await insertLifecycleDateTransaction(entity.lifecycleDate, db)
      await insertProductAssetModelTransaction(entity.productAssetModel, db)

      entity.asset.location = null

      await insertAssetTransaction(entity.asset, db)
      await insertAssetPsrTransaction(entity.assetPsr, db)
      await insertZeroSequenceImpedanceTransaction(entity.zeroSequenceImpedance, db)
      await insertShortCircuitRatingTransaction(entity.shortCircuitRating, db)

      if (entity.attachment.id && Array.isArray(JSON.parse(entity.attachment.path))) {
        const pathData = JSON.parse(entity.attachment.path)
        const newPath: any[] = []
        for (let i = 0; i < pathData.length; i++) {
          const namefile = path.basename(pathData[i].path)
          pathData[i].path = path.join(
            attachmentContext.getAttachmentDir(),
            entity.asset.mrid,
            namefile
          )
          newPath.push(pathData[i])
        }
        entity.attachment.path = JSON.stringify(newPath)
        await uploadAttachmentTransaction(entity.attachment, db)
      }

      let toDeleteTable: any = {}
      for (const tableType of tableTypes) {
        const newIds = entity[tableType].map((v: any) => v.mrid).filter((id: any) => id)
        const oldIds = old_entity[tableType].map((v: any) => v.mrid).filter((id: any) => id)

        const toAdd = entity[tableType].filter((v: any) => v.mrid && !oldIds.includes(v.mrid))
        toDeleteTable[tableType] = old_entity[tableType].filter(
          (v: any) => v.mrid && !newIds.includes(v.mrid)
        )
        const toUpdate = entity[tableType].filter((v: any) => v.mrid && oldIds.includes(v.mrid))
        for (const table of toAdd) {
          await insertTable(tableType, table, db)
        }
        for (const table of toUpdate) {
          await insertTable(tableType, table, db)
        }
      }

      if (entity.tapChanger) {
        const tc = entity.tapChanger
        const oldTc = old_entity.tapChanger
        if (tc.productAssetModel && tc.productAssetModel.mrid) {
          await insertProductAssetModelTransaction(tc.productAssetModel, db)
        }
        if (tc.oldTapChangerInfo && tc.oldTapChangerInfo.mrid) {
          tc.oldTapChangerInfo.power_transformer_info_id = entity.oldPowerTransformerInfo.mrid
          await insertOldTapChangerInfoTransaction(tc.oldTapChangerInfo, db)
        }
        if (tc.asset && tc.asset.mrid) {
          await insertAssetTransaction(tc.asset, db)
        }
        const newIds = tc.voltage.map((v: any) => v.mrid).filter((id: any) => id)
        const oldIds = oldTc.voltage.map((v: any) => v.mrid).filter((id: any) => id)

        const toAdd = tc.voltage.filter((v: any) => v.mrid && !oldIds.includes(v.mrid))
        const toDelete = oldTc.voltage.filter((v: any) => v.mrid && !newIds.includes(v.mrid))
        const toUpdate = tc.voltage.filter((v: any) => v.mrid && oldIds.includes(v.mrid))
        for (const voltage of toAdd) {
          await insertVoltageTransaction(voltage, db)
        }
        for (const voltage of toUpdate) {
          await insertVoltageTransaction(voltage, db)
        }

        const newIdsPoint = tc.tapChangerTablePoint.map((v: any) => v.mrid).filter((id: any) => id)
        const oldIdsPoint = oldTc.tapChangerTablePoint
          .map((v: any) => v.mrid)
          .filter((id: any) => id)

        const toAddPoint = tc.tapChangerTablePoint.filter(
          (v: any) => v.mrid && !oldIdsPoint.includes(v.mrid)
        )
        const toDeletePoint = oldTc.tapChangerTablePoint.filter(
          (v: any) => v.mrid && !newIdsPoint.includes(v.mrid)
        )
        const toUpdatePoint = tc.tapChangerTablePoint.filter(
          (v: any) => v.mrid && oldIdsPoint.includes(v.mrid)
        )
        for (const tapChangerTablePoint of toAddPoint) {
          await insertTapChangerTablePointTransaction(tapChangerTablePoint, db)
        }
        for (const tapChangerTablePoint of toUpdatePoint) {
          await insertTapChangerTablePointTransaction(tapChangerTablePoint, db)
        }

        for (const tapChangerTablePoint of toDeletePoint) {
          await deleteTapChangerTablePointTransaction(tapChangerTablePoint.mrid, db)
        }

        for (const voltage of toDelete) {
          await deleteVoltageByIdTransaction(voltage.mrid, db)
        }
      }

      const newIdsBushing = entity.bushing.map((v: any) => v.bushing.mrid).filter((id: any) => id)
      const oldIdsBushing = old_entity.bushing
        .map((v: any) => v.bushing.mrid)
        .filter((id: any) => id)

      const toAddBushing = entity.bushing.filter(
        (v: any) => v.bushing.mrid && !oldIdsBushing.includes(v.bushing.mrid)
      )
      const toDeleteBushing = old_entity.bushing.filter(
        (v: any) => v.bushing.mrid && !newIdsBushing.includes(v.bushing.mrid)
      )

      const toUpdateBushing = entity.bushing.filter(
        (v: any) => v.bushing.mrid && oldIdsBushing.includes(v.bushing.mrid)
      )
      for (const bushing of toAddBushing) {
        await bushingFunc.insertBushingEntityLiteTransaction(bushing, db)
      }
      for (const bushing of toUpdateBushing) {
        await bushingFunc.insertBushingEntityLiteTransaction(bushing, db)
      }
      for (const bushing of toDeleteBushing) {
        await bushingFunc.deleteBushingEntityLiteTransaction(bushing, db)
      }

      const newIdsSurge = entity.surgeArrester
        .map((v: any) => v.surgeArrester.mrid)
        .filter((id: any) => id)
      const oldIdsSurge = old_entity.surgeArrester
        .map((v: any) => v.surgeArrester.mrid)
        .filter((id: any) => id)

      const toAddSurge = entity.surgeArrester.filter(
        (v: any) => v.surgeArrester.mrid && !oldIdsSurge.includes(v.surgeArrester.mrid)
      )
      const toDeleteSurge = old_entity.surgeArrester.filter(
        (v: any) => v.surgeArrester.mrid && !newIdsSurge.includes(v.surgeArrester.mrid)
      )

      const toUpdateSurge = entity.surgeArrester.filter(
        (v: any) => v.surgeArrester.mrid && oldIdsSurge.includes(v.surgeArrester.mrid)
      )
      for (const surge of toAddSurge) {
        await insertSurgeArresterLiteEntity(surge, new SurgeArrester(), db)
      }
      for (const surge of toUpdateSurge) {
        const oldSurge = old_entity.surgeArrester.find(
          (x: any) => x.surgeArrester.mrid === surge.surgeArrester.mrid
        )
        await insertSurgeArresterLiteEntity(surge, oldSurge, db)
      }
      for (const surge of toDeleteSurge) {
        await deleteSurgeArresterLiteEntity(surge, db)
      }

      for (const tableType of [...tableTypes].reverse()) {
        for (const t of toDeleteTable[tableType]) {
          await deleteTable(tableType, t.mrid, db)
        }
      }

      for (const unitType of [...unitTypes].reverse()) {
        for (const u of toDeleteUnit[unitType]) {
          await deleteUnit(unitType, u.mrid, db)
        }
      }

      await runAsync('COMMIT')
      deleteBackupFiles(null, entity.asset.mrid)
      return { success: true, data: entity, message: 'Transformer entity inserted successfully' }
    }
  } catch (error: any) {
    restoreFiles(null, null, entity.asset.mrid)
    deleteBackupFiles(null, entity.asset.mrid)
    console.error('Error retrieving transformer entity:', error)
    await runAsync('ROLLBACK')
    return { success: false, error, message: 'Error retrieving transformer entity' }
  }
}

export const getTransformerEntityById: any = async (id: string, psrId: string) => {
  try {
    if (id == null || id === '') {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      let frequencyIds: any[] = []
      let voltageIds: any[] = []
      let apparentPowerIds: any[] = []
      let temperatureIds: any[] = []
      let currentFlowIds: any[] = []
      let secondIds: any[] = []
      let percentIDs: any[] = []
      let baseVoltageIds: any[] = []
      let basePowerIds: any[] = []
      let activePowerIds: any[] = []

      const entity = new TransformerEntity()
      const dataTransformer: any = await getAssetById(id)
      if (dataTransformer.success) {
        entity.asset = dataTransformer.data
        const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(entity.asset.mrid, psrId)
        if (dataAssetPsr.success) {
          entity.assetPsr = dataAssetPsr.data
        }
        const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date)
        if (dataLifecycleDate.success) {
          entity.lifecycleDate = dataLifecycleDate.data
        }
        const dataAttachment: any = await getAttachmentByForeignIdAndType(
          entity.asset.mrid,
          'asset'
        )
        if (dataAttachment.success) {
          entity.attachment = dataAttachment.data
        }
        const dataOldTransformerInfo: any = await getOldPowerTransformerInfoById(
          entity.asset.asset_info
        )
        if (dataOldTransformerInfo.success) {
          entity.oldPowerTransformerInfo = dataOldTransformerInfo.data
          frequencyIds.push(entity.oldPowerTransformerInfo.rated_frequency)
          temperatureIds.push(entity.oldPowerTransformerInfo.impedance_temperature)
        }

        const dataProductAssetModel: any = await getProductAssetModelById(
          entity.asset.product_asset_model
        )
        if (dataProductAssetModel.success) {
          entity.productAssetModel = dataProductAssetModel.data
        }

        const dataOldTransformerEndInfo: any =
          await getOldTransformerEndInfoByPowerTransformerInfoId(entity.asset.asset_info)
        if (dataOldTransformerEndInfo.success) {
          entity.oldTransformerEndInfo = dataOldTransformerEndInfo.data
        }

        const dataOther: any = await getOtherByPowerTransformerInfoId(
          entity.oldPowerTransformerInfo.mrid
        )
        if (dataOther.success) {
          entity.other = dataOther.data
          if (entity.other.insulation_weight) {
            const dataMassWeight: any = await getMassByIds([entity.other.insulation_weight])
            if (dataMassWeight.success && dataMassWeight.data.length > 0) {
              entity.mass.push(dataMassWeight.data[0])
            }
          }
          if (entity.other.insulation_volume) {
            const dataVolumeInsulation: any = await getVolumeByIds([entity.other.insulation_volume])
            if (dataVolumeInsulation.success && dataVolumeInsulation.data.length > 0) {
              entity.volume.push(dataVolumeInsulation.data[0])
            }
          }
          if (entity.productAssetModel.weight_total) {
            const dataMassTotal: any = await getMassByIds([entity.productAssetModel.weight_total])
            if (dataMassTotal.success && dataMassTotal.data.length > 0) {
              entity.mass.push(dataMassTotal.data[0])
            }
          }
        }

        for (const dataEndInfo of entity.oldTransformerEndInfo) {
          const dataVoltageRating: any = await getVoltageRatingByTransformerEndId(dataEndInfo.mrid)
          if (dataVoltageRating.success) {
            for (const rating of dataVoltageRating.data) {
              voltageIds.push(rating.rated_u)
              voltageIds.push(rating.rated_ln)
              voltageIds.push(rating.insulation_u)
            }
            entity.voltageRating = entity.voltageRating.concat(dataVoltageRating.data)
          }
        }

        const dataCoolingPowerRating: any = await getCoolingPowerRatingByPowerTransformerInfoId(
          entity.oldPowerTransformerInfo.mrid
        )
        if (dataCoolingPowerRating.success) {
          entity.coolingPowerRating = dataCoolingPowerRating.data
          for (const powerRating of entity.coolingPowerRating) {
            apparentPowerIds.push(powerRating.power_rating)
            temperatureIds.push(powerRating.temp_rise_wind)
          }
        }

        for (const powerRating of entity.coolingPowerRating) {
          const dataCurrentRating: any = await getCurrentRatingByRatedPower(
            powerRating.power_rating
          )
          if (dataCurrentRating.success) {
            for (const currentRating of dataCurrentRating.data) {
              currentFlowIds.push(currentRating.value)
            }
            entity.currentRating = entity.currentRating.concat(dataCurrentRating.data)
          }
        }

        const dataShortCircuitRating: any = await getShortCircuitRatingByPowerTransformerInfoId(
          entity.oldPowerTransformerInfo.mrid
        )
        if (dataShortCircuitRating.success) {
          entity.shortCircuitRating = dataShortCircuitRating.data
          secondIds.push(entity.shortCircuitRating.duration_seconds)
          currentFlowIds.push(entity.shortCircuitRating.short_circuit_current)
        }

        for (const shortCircuitTest of entity.oldTransformerEndInfo) {
          const dataShortCircuitTest: any = await getShortCircuitTestByTransformerEndInfoId(
            shortCircuitTest.mrid
          )
          if (dataShortCircuitTest.success) {
            for (const sct of dataShortCircuitTest.data) {
              percentIDs.push(sct.voltage)
              baseVoltageIds.push(sct.base_voltage)
              basePowerIds.push(sct.base_power)
              activePowerIds.push(sct.loss)
            }
            entity.shortCircuitTest = entity.shortCircuitTest.concat(dataShortCircuitTest.data)
          }
        }

        for (const shortCircuitTest of entity.shortCircuitTest) {
          const dataSCTTransformerEndInfo: any = await getSCTTransformerEndInfoByShortCircuitTestId(
            shortCircuitTest.mrid
          )
          if (dataSCTTransformerEndInfo.success) {
            entity.shortCircuitTestTransformerEndInfo =
              entity.shortCircuitTestTransformerEndInfo.concat(dataSCTTransformerEndInfo.data)
          }
        }

        const dataZeroSequenceImpedance: any = await getZeroSequenceImpedanceByTransformerInfoId(
          entity.oldPowerTransformerInfo.mrid
        )
        if (dataZeroSequenceImpedance.success) {
          entity.zeroSequenceImpedance = dataZeroSequenceImpedance.data
          baseVoltageIds.push(entity.zeroSequenceImpedance.base_voltage)
          basePowerIds.push(entity.zeroSequenceImpedance.base_power)
        }

        const dataZeroSequenceImpedanceTable: any =
          await getZeroSequenceImpedanceTableByZeroSequenceImpedanceId(
            entity.zeroSequenceImpedance.mrid
          )
        if (dataZeroSequenceImpedanceTable.success) {
          entity.zeroSequenceImpedanceTable = dataZeroSequenceImpedanceTable.data
          for (const zero of entity.zeroSequenceImpedanceTable) {
            percentIDs.push(zero.zero)
          }
        }

        const dataOldTapChangerInfo: any = await getOldTapChangerInfoByPowerTransformerInfoId(
          entity.oldPowerTransformerInfo.mrid
        )
        if (dataOldTapChangerInfo.success) {
          entity.tapChanger.oldTapChangerInfo = dataOldTapChangerInfo.data
        }

        const dataTapChanger: any = await getAssetByAssetInfoId(
          entity.tapChanger.oldTapChangerInfo.mrid
        )
        if (dataTapChanger.success) {
          entity.tapChanger.asset = dataTapChanger.data
        }

        const dataProductAssetModelTapChanger: any = await getProductAssetModelById(
          entity.tapChanger.oldTapChangerInfo.product_asset_model
        )
        if (dataProductAssetModelTapChanger.success) {
          entity.tapChanger.productAssetModel = dataProductAssetModelTapChanger.data
        }

        const dataTapChangerTablePoint: any = await getTapChangerTablePointByTapChangerInfoId(
          entity.tapChanger.oldTapChangerInfo.mrid
        )
        if (dataTapChangerTablePoint.success) {
          entity.tapChanger.tapChangerTablePoint = dataTapChangerTablePoint.data
        }

        const dataTapChangerVoltage: any = await getVoltageByIds(
          entity.tapChanger.tapChangerTablePoint.map((x: any) => x.voltage)
        )
        if (dataTapChangerVoltage.success) {
          entity.tapChanger.voltage = dataTapChangerVoltage.data
        }

        const idsTransformerEndInfo = entity.oldTransformerEndInfo.map((x: any) => x.mrid)
        const dataMridOldBushingInfo: any =
          await getOldBushingInfoByTransformerEndInfoIds(idsTransformerEndInfo)
        if (dataMridOldBushingInfo.success) {
          const dataMridOldBushingInfoIds = dataMridOldBushingInfo.data
          for (const dataMridOldBushingInfoId of dataMridOldBushingInfoIds) {
            const dataMridBushing: any = await getAssetByAssetInfoId(dataMridOldBushingInfoId.mrid)
            if (dataMridBushing.success) {
              const dataBushing: any = await bushingFunc.getBushingEntityLiteById(
                dataMridBushing.data.mrid
              )
              if (dataBushing.success) {
                entity.bushing.push(dataBushing.data)
              }
            }
          }
        }

        const dataSurgeArrester: any = await getSurgeArresterByAssetId(entity.asset.mrid)
        if (dataSurgeArrester.success) {
          for (const surge of dataSurgeArrester.data) {
            const dataSurge: any = await getSurgeArresterLiteEntityById(surge.mrid)
            if (dataSurge.success) {
              entity.surgeArrester.push(dataSurge.data)
            }
          }
        }

        const dataFrequency: any = await getFrequencyByIds(frequencyIds)
        if (dataFrequency.success) {
          entity.frequency = dataFrequency.data
        }

        const dataTemperature: any = await getTemperatureByIds(temperatureIds)
        if (dataTemperature.success) {
          entity.temperature = dataTemperature.data
        }

        const dataSeconds: any = await getSecondByIds(secondIds)
        if (dataSeconds.success) {
          entity.seconds = dataSeconds.data
        }

        const dataCurrentFlow: any = await getCurrentFlowByIds(currentFlowIds)
        if (dataCurrentFlow.success) {
          entity.currentFlow = dataCurrentFlow.data
        }

        const dataPercent: any = await getPercentByIds(percentIDs)
        if (dataPercent.success) {
          entity.percent = dataPercent.data
        }

        const dataActivePower: any = await getActivePowerByIds(activePowerIds)
        if (dataActivePower.success) {
          entity.activePower = dataActivePower.data
        }

        const dataBaseVoltage: any = await getBaseVoltageByIds(baseVoltageIds)
        if (dataBaseVoltage.success) {
          entity.baseVoltage = dataBaseVoltage.data
        }

        for (const baseVoltage of entity.baseVoltage) {
          voltageIds.push(baseVoltage.nominal_voltage)
        }

        const dataBasePower: any = await getBasePowerByIds(basePowerIds)
        if (dataBasePower.success) {
          entity.basePower = dataBasePower.data
        }

        for (const basePower of entity.basePower) {
          apparentPowerIds.push(basePower.base_power)
        }

        const dataVoltage: any = await getVoltageByIds(voltageIds)
        if (dataVoltage.success) {
          entity.voltage = dataVoltage.data
        }

        const dataApprentPower: any = await getApparentPowerByIds(apparentPowerIds)
        if (dataApprentPower.success) {
          entity.apparentPower = dataApprentPower.data
        }

        return {
          success: true,
          data: entity,
          message: 'Transformer entity retrieved successfully'
        }
      } else {
        return { success: false, error: dataTransformer.error, message: dataTransformer.message }
      }
    }
  } catch (error: any) {
    console.error('Error retrieving Transformer entity by ID:', error)
    return { success: false, error, message: 'Error retrieving Transformer entity by ID' }
  }
}

export const deleteTransformerEntity: any = async (data: any) => {
  try {
    if (data.asset == null || data.asset.mrid == null || data.asset.mrid === '') {
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

        for (const bushing of data.bushing) {
          await bushingFunc.deleteBushingEntityLiteTransaction(bushing, db)
        }

        for (const surge of data.surgeArrester) {
          const surgeVoltages = surge.voltage ? [...surge.voltage] : []
          surge.voltage = []
          await deleteSurgeArresterLiteEntity(surge, db)
          for (const volt of surgeVoltages) {
            if (volt.mrid) {
              await tryDelete(deleteVoltageByIdTransaction, volt.mrid, db, 'SurgeArresterVoltage')
            }
          }
        }

        if (data.tapChanger) {
          if (data.tapChanger.tapChangerTablePoint) {
            for (const point of data.tapChanger.tapChangerTablePoint) {
              if (point.mrid) {
                await deleteTapChangerTablePointTransaction(point.mrid, db)
              }
            }
          }
          if (data.tapChanger.asset && data.tapChanger.asset.mrid) {
            await deleteAssetByIdTransaction(data.tapChanger.asset.mrid, db)
          }
          if (data.tapChanger.oldTapChangerInfo && data.tapChanger.oldTapChangerInfo.mrid) {
            await deleteOldTapChangerInfoTransaction(data.tapChanger.oldTapChangerInfo.mrid, db)
          }
          if (data.tapChanger.voltage) {
            for (const volt of data.tapChanger.voltage) {
              if (volt.mrid) {
                await tryDelete(deleteVoltageByIdTransaction, volt.mrid, db, 'TapChangerVoltage')
              }
            }
          }
          if (data.tapChanger.productAssetModel && data.tapChanger.productAssetModel.mrid) {
            const isUsedAsset = await isUsedInTable(
              'asset',
              'product_asset_model',
              data.tapChanger.productAssetModel.mrid,
              db
            )
            const isUsedInfo = await isUsedInTable(
              'asset_info',
              'product_asset_model',
              data.tapChanger.productAssetModel.mrid,
              db
            )

            if (!isUsedInfo && !isUsedAsset) {
              await deleteProductAssetModelByIdTransaction(
                data.tapChanger.productAssetModel.mrid,
                db
              )
            }
          }
        }
        if (data.assetPsr && data.assetPsr.mrid) {
          await deleteAssetPsrTransaction(data.assetPsr.mrid, db)
        }
        for (const shortCircuitTestTransformerEndInfo of data.shortCircuitTestTransformerEndInfo) {
          if (shortCircuitTestTransformerEndInfo.mrid) {
            await deleteSCTTransformerEndInfoByIdTransaction(
              shortCircuitTestTransformerEndInfo.mrid,
              db
            )
          }
        }
        for (const shortCircuitTest of data.shortCircuitTest) {
          if (shortCircuitTest.mrid) {
            await deleteShortCircuitTestByIdTransaction(shortCircuitTest.mrid, db)
          }
        }
        for (const zeroSequenceImpedanceTable of data.zeroSequenceImpedanceTable) {
          if (zeroSequenceImpedanceTable.mrid) {
            await deleteZeroSequenceImpedanceTableTransaction(zeroSequenceImpedanceTable.mrid, db)
          }
        }
        if (data.zeroSequenceImpedance && data.zeroSequenceImpedance.mrid) {
          await deleteZeroSequenceImpedanceTransaction(data.zeroSequenceImpedance.mrid, db)
        }
        if (data.shortCircuitRating && data.shortCircuitRating.mrid) {
          await deleteShortCircuitRatingByIdTransaction(data.shortCircuitRating.mrid, db)
        }
        for (const currentRating of data.currentRating) {
          if (currentRating.mrid) {
            await deleteCurrentRatingByIdTransaction(currentRating.mrid, db)
          }
        }
        for (const coolingPowerRating of data.coolingPowerRating) {
          if (coolingPowerRating.mrid) {
            await deleteCoolingPowerRatingTransaction(coolingPowerRating.mrid, db)
          }
        }
        for (const voltageRating of data.voltageRating) {
          if (voltageRating.mrid) {
            await deleteVoltageRatingTransaction(voltageRating.mrid, db)
          }
        }
        for (const oldTransformerEndInfo of data.oldTransformerEndInfo) {
          if (oldTransformerEndInfo.mrid) {
            await deleteOldTransformerEndInfoTransaction(oldTransformerEndInfo.mrid, db)
          }
        }
        if (data.asset.mrid) {
          await deleteAssetByIdTransaction(data.asset.mrid, db)
        }

        if (data.other && data.other.mrid) {
          await tryDelete(deleteOtherByIdTransaction, data.other.mrid, db, 'Other')
        }

        if (data.oldPowerTransformerInfo && data.oldPowerTransformerInfo.mrid) {
          const isUsed = await isUsedInTable(
            'Asset',
            'asset_info',
            data.oldPowerTransformerInfo.mrid,
            db
          )
          if (!isUsed) {
            await deleteOldPowerTransformerInfoTransaction(data.oldPowerTransformerInfo.mrid, db)
          } else {
            console.warn(
              `Skipping deleteOldPowerTransformerInfo: Used by other assets (${data.oldPowerTransformerInfo.mrid})`
            )
          }
        }

        if (data.lifecycleDate && data.lifecycleDate.mrid) {
          const isUsed = await isUsedInTable('Asset', 'lifecycle_date', data.lifecycleDate.mrid, db)
          if (!isUsed) {
            await deleteLifecycleDateByIdTransaction(data.lifecycleDate.mrid, db)
          } else {
            console.warn(
              `Skipping deleteLifecycleDate: Used by other assets (${data.lifecycleDate.mrid})`
            )
          }
        }

        if (data.productAssetModel && data.productAssetModel.mrid) {
          const isUsed = await isUsedInTable(
            'Asset',
            'product_asset_model',
            data.productAssetModel.mrid,
            db
          )
          if (!isUsed) {
            await deleteProductAssetModelByIdTransaction(data.productAssetModel.mrid, db)
          } else {
            console.warn(
              `Skipping deleteProductAssetModel: Used by other assets (${data.productAssetModel.mrid})`
            )
          }
        }

        for (const basePower of data.basePower) {
          if (basePower.mrid)
            await tryDelete(deleteBasePowerByIdTransaction, basePower.mrid, db, 'basePower')
        }
        for (const baseVoltage of data.baseVoltage) {
          if (baseVoltage.mrid)
            await tryDelete(deleteBaseVoltageByIdTransaction, baseVoltage.mrid, db, 'baseVoltage')
        }
        for (const voltage of data.voltage) {
          if (voltage.mrid)
            await tryDelete(deleteVoltageByIdTransaction, voltage.mrid, db, 'voltage')
        }
        for (const seconds of data.seconds) {
          if (seconds.mrid)
            await tryDelete(deleteSecondsByIdTransaction, seconds.mrid, db, 'seconds')
        }
        for (const currentFlow of data.currentFlow) {
          if (currentFlow.mrid)
            await tryDelete(deleteCurrentFlowByIdTransaction, currentFlow.mrid, db, 'currentFlow')
        }
        for (const percent of data.percent) {
          if (percent.mrid)
            await tryDelete(deletePercentByIdTransaction, percent.mrid, db, 'percent')
        }
        for (const activePower of data.activePower) {
          if (activePower.mrid)
            await tryDelete(deleteActivePowerByIdTransaction, activePower.mrid, db, 'activePower')
        }
        for (const apparentPower of data.apparentPower) {
          if (apparentPower.mrid)
            await tryDelete(
              deleteApparentPowerByIdTransaction,
              apparentPower.mrid,
              db,
              'apparentPower'
            )
        }
        for (const frequency of data.frequency) {
          if (frequency.mrid)
            await tryDelete(deleteFrequencyByIdTransaction, frequency.mrid, db, 'frequency')
        }
        for (const temperature of data.temperature) {
          if (temperature.mrid)
            await tryDelete(deleteTemperatureByIdTransaction, temperature.mrid, db, 'temperature')
        }
        for (const mass of data.mass) {
          if (mass.mrid) await tryDelete(deleteMassByIdTransaction, mass.mrid, db, 'mass')
        }
        for (const volume of data.volume) {
          if (volume.mrid) await tryDelete(deleteVolumeByIdTransaction, volume.mrid, db, 'volume')
        }

        await runAsync('COMMIT')
        if (data.attachment && data.attachment.id) {
          deleteDirectory(null, data.asset.mrid)
        }
        return { success: true, message: 'Transformer entity deleted successfully' }
      } catch (error: any) {
        await runAsync('ROLLBACK')
        console.error('Error deleting Transformer entity:', error)
        return { success: false, error, message: 'Error deleting Transformer entity' }
      }
    }
  } catch (error: any) {
    console.error('Error deleting Transformer entity:', error)
    return { success: false, error, message: 'Error deleting Transformer entity' }
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
