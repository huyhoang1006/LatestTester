import db from '../../datacontext/index'
import path from 'path'
import * as attachmentContext from '../../attachmentcontext/index'
import {
  uploadAttachmentTransaction,
  backupAllFilesInDir,
  deleteBackupFiles,
  restoreFiles,
  syncFilesWithDeletion,
  getAttachmentByForeignIdAndType
} from '@/function/entity/attachment'
import {
  insertVoltageTransaction,
  deleteVoltageByIdTransaction,
  getVoltageByIds
} from '@/function/cim/voltage'
import {
  insertCurrentFlowTransaction,
  getCurrentFlowByIds,
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
  insertLengthTransaction,
  getLengthByIds,
  deleteLengthByIdTransaction
} from '@/function/cim/length'
import { insertAreaTransaction, getAreaByIds, deleteAreaByIdTransaction } from '@/function/cim/area'
import {
  insertFrequencyTransaction,
  getFrequencyByIds,
  deleteFrequencyByIdTransaction
} from '@/function/cim/frequency'
import {
  insertTemperatureTransaction,
  getTemperatureByIds,
  deleteTemperatureByIdTransaction
} from '@/function/cim/temperature'
import {
  getAssetById,
  insertAssetTransaction,
  deleteAssetByIdTransaction
} from '@/function/cim/asset'
import {
  getConcentricNeutralCableInfoById,
  insertConcentricNeutralCableInfoTransaction,
  deleteConcentricNeutralCableInfoTransaction
} from '@/function/cim/concentricNeutralCableInfo'
import {
  insertJointCableInfoTransaction,
  getJointCableInfoByCableInfoId
} from '@/function/cim/jointCableInfo'
import {
  insertOldCableInfoTransaction,
  getOldCableInfoByCableInfoId
} from '@/function/cim/oldCableInfo'
import {
  insertSheathVoltageLimiterTransaction,
  getSheathVoltageLimiterByCableInfoId
} from '@/function/cim/sheathVoltageLimiter'
import {
  insertTerminalCableInfoTransaction,
  getTerminalCableInfoByCableInfoId
} from '@/function/cim/terminalCableInfo'
import {
  insertSecondsTransaction,
  getSecondByIds,
  deleteSecondsByIdTransaction
} from '@/function/cim/seconds'
import PowerCableEntity from '@/views/Flatten/PowerCable/index'

export const insertPowerCableEntity: any = async (old_entity: any, entity: any) => {
  try {
    if (entity.asset.mrid === null || entity.asset.mrid === '') {
      return {
        success: false,
        error: new Error('MRID is required for Power Cable Entity'),
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
        deleteBackupFiles(null, entity.asset.mrid)
        return {
          success: false,
          error: new Error('MRID is required for Power Cable Entity'),
          message: ''
        }
      }
      await runAsync('BEGIN TRANSACTION')

      const syncUnits = (
        newList: any[],
        oldList: any[],
        insertFn: any,
        deleteFn: any,
        name: string
      ) => {
        const newIds: any[] = (newList || []).map((s: any) => s.mrid).filter((id: any) => id)
        const oldIds: any[] = (oldList || []).map((s: any) => s.mrid).filter((id: any) => id)
        const toAdd = (newList || []).filter((s: any) => s.mrid && !oldIds.includes(s.mrid))
        const toDelete = (oldList || []).filter((s: any) => s.mrid && !newIds.includes(s.mrid))
        const toUpdate = (newList || []).filter((s: any) => s.mrid && oldIds.includes(s.mrid))
        for (const item of toAdd) insertFn(item, db)
        for (const item of toUpdate) insertFn(item, db)
        for (const item of toDelete) deleteUnitSafely(deleteFn, item.mrid, db)
        void name
      }

      syncUnits(
        entity.area,
        old_entity.area,
        insertAreaTransaction,
        deleteAreaByIdTransaction,
        'area'
      )
      syncUnits(
        entity.currentFlow,
        old_entity.currentFlow,
        insertCurrentFlowTransaction,
        deleteCurrentFlowByIdTransaction,
        'currentFlow'
      )
      syncUnits(
        entity.second,
        old_entity.second,
        insertSecondsTransaction,
        deleteSecondsByIdTransaction,
        'second'
      )
      syncUnits(
        entity.frequency,
        old_entity.frequency,
        insertFrequencyTransaction,
        deleteFrequencyByIdTransaction,
        'frequency'
      )
      syncUnits(
        entity.length,
        old_entity.length,
        insertLengthTransaction,
        deleteLengthByIdTransaction,
        'length'
      )
      syncUnits(
        entity.voltage,
        old_entity.voltage,
        insertVoltageTransaction,
        deleteVoltageByIdTransaction,
        'voltage'
      )
      syncUnits(
        entity.temperature,
        old_entity.temperature,
        insertTemperatureTransaction,
        deleteTemperatureByIdTransaction,
        'temperature'
      )

      await insertLifecycleDateTransaction(entity.lifecycleDate, db)
      await insertProductAssetModelTransaction(entity.productAssetModel, db)
      await insertConcentricNeutralCableInfoTransaction(entity.concentricNeutral, db)
      await insertJointCableInfoTransaction(entity.joint, db)
      await insertSheathVoltageLimiterTransaction(entity.sheathVoltageLimiter, db)
      await insertTerminalCableInfoTransaction(entity.terminal, db)
      await insertOldCableInfoTransaction(entity.oldCableInfo, db)
      await insertAssetTransaction(entity.asset, db)
      await insertAssetPsrTransaction(entity.assetPsr, db)

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

      await runAsync('COMMIT')
      deleteBackupFiles(null, entity.asset.mrid)
      return { success: true, data: entity, message: 'Power cable entity inserted successfully' }
    }
  } catch (error: any) {
    restoreFiles(null, null, entity.asset.mrid)
    deleteBackupFiles(null, entity.asset.mrid)
    console.error('Error retrieving Power Cable entity:', error)
    await runAsync('ROLLBACK')
    return { success: false, error, message: 'Error retrieving Power Cable entity' }
  }
}

export const getPowerCableEntity: any = async (id: string, psrId: string) => {
  try {
    if (id == null || id === '') {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      const entity = new PowerCableEntity()
      const dataPowerCable: any = await getAssetById(id)
      if (dataPowerCable.success) {
        entity.asset = dataPowerCable.data
        const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date)
        if (dataLifecycleDate.success) {
          entity.lifecycleDate = dataLifecycleDate.data
        }
        const dataCencentricNeutralInfo: any = await getConcentricNeutralCableInfoById(
          entity.asset.asset_info
        )
        if (dataCencentricNeutralInfo.success) {
          entity.concentricNeutral = dataCencentricNeutralInfo.data
        }

        const productAssetModelId = entity.asset.product_asset_model
        const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId)
        if (dataProductAssetModel.success) {
          entity.productAssetModel = dataProductAssetModel.data
        }

        const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(entity.asset.mrid, psrId)
        if (dataAssetPsr.success) {
          entity.assetPsr = dataAssetPsr.data
        }

        const dataAttachment: any = await getAttachmentByForeignIdAndType(
          entity.asset.mrid,
          'asset'
        )
        if (dataAttachment.success) {
          entity.attachment = dataAttachment.data
        }

        const dataOldCableInfo: any = await getOldCableInfoByCableInfoId(
          entity.concentricNeutral.mrid
        )
        if (dataOldCableInfo.success) {
          entity.oldCableInfo = dataOldCableInfo.data
        }

        const dataJointInfo: any = await getJointCableInfoByCableInfoId(
          entity.concentricNeutral.mrid
        )
        if (dataJointInfo.success) {
          entity.joint = dataJointInfo.data
        }

        const terminalCableInfo: any = await getTerminalCableInfoByCableInfoId(
          entity.concentricNeutral.mrid
        )
        if (terminalCableInfo.success) {
          entity.terminal = terminalCableInfo.data
        }

        const sheathVoltageLimiter: any = await getSheathVoltageLimiterByCableInfoId(
          entity.concentricNeutral.mrid
        )
        if (sheathVoltageLimiter.success) {
          entity.sheathVoltageLimiter = sheathVoltageLimiter.data
        }

        const joint_cable_info_arr: any = {
          currentFlow: ['rated_current'],
          voltage: ['rated_u']
        }
        const terminal_cable_info_arr: any = {
          voltage: ['rated_u', 'bil', 'bsl']
        }
        const sheath_voltage_limiter_arr: any = {
          currentFlow: [
            'nominal_discharge_current',
            'high_current_impulse_withstand',
            'long_duration_current_impulse_withstand',
            'short_circuit_withstand'
          ],
          voltage: ['rated_voltage_ur', 'max_continuous_operating_voltage']
        }
        const oldCableInfoArr: any = {
          voltage: ['rated_u', 'max_u'],
          currentFlow: ['short_circuit_current'],
          second: ['rated_duration_short_circuit'],
          temperature: ['insulation_max_operating_temp'],
          area: ['conductor_size', 'armour_cross_sectional_area_tap', 'concentric_area'],
          frequency: ['rated_frequency'],
          length: [
            'armour_bedding_thickness',
            'armour_thickness',
            'concentric_length_lay',
            'concentric_thickness',
            'conductor_shield_thickness',
            'nominal_conductor_diameter',
            'diameter_over_shield',
            'diameter_over_sheath',
            'diameter_over_armour',
            'diameter_bedding_over_armour',
            'diameter_over_sheath_reinforcing',
            'sheath_thickness',
            'sheath_reinforcing_thickness',
            'sheath_reinforcing_length_lay',
            'sheath_reinforcing_width',
            'jacket_thickness',
            'screen_thickness',
            'length'
          ]
        }
        const concentricNeutral: any = {
          length: [
            'insulation_thickness',
            'diameter_over_insulation',
            'diameter_over_screen',
            'diameter_over_neutral',
            'diameter_over_jacket'
          ]
        }

        const dataDB = [
          joint_cable_info_arr,
          terminal_cable_info_arr,
          sheath_voltage_limiter_arr,
          concentricNeutral,
          oldCableInfoArr
        ]
        const entityDB = [
          'joint',
          'terminal',
          'sheathVoltageLimiter',
          'concentricNeutral',
          'oldCableInfo'
        ]

        const voltage: any[] = [],
          currentFlow: any[] = [],
          second: any[] = [],
          temperature: any[] = [],
          area: any[] = [],
          frequency: any[] = [],
          length: any[] = []

        for (const i in dataDB) {
          const item = dataDB[i]
          for (const key in item) {
            for (const field of item[key]) {
              const val = entity[entityDB[i]][field]
              if (val != null) {
                if (key === 'voltage') voltage.push(val)
                else if (key === 'currentFlow') currentFlow.push(val)
                else if (key === 'second') second.push(val)
                else if (key === 'temperature') temperature.push(val)
                else if (key === 'area') area.push(val)
                else if (key === 'frequency') frequency.push(val)
                else if (key === 'length') length.push(val)
              }
            }
          }
        }

        const dataVoltage: any = await getVoltageByIds(voltage)
        if (dataVoltage.success) entity.voltage = dataVoltage.data

        const dataCurrentFlow: any = await getCurrentFlowByIds(currentFlow)
        if (dataCurrentFlow.success) entity.currentFlow = dataCurrentFlow.data

        const dataSecond: any = await getSecondByIds(second)
        if (dataSecond.success) entity.second = dataSecond.data

        const dataTemperature: any = await getTemperatureByIds(temperature)
        if (dataTemperature.success) entity.temperature = dataTemperature.data

        const dataArea: any = await getAreaByIds(area)
        if (dataArea.success) entity.area = dataArea.data

        const dataFrequency: any = await getFrequencyByIds(frequency)
        if (dataFrequency.success) entity.frequency = dataFrequency.data

        const dataLength: any = await getLengthByIds(length)
        if (dataLength.success) entity.length = dataLength.data

        return { success: true, data: entity, message: 'Power Cable entity retrieved successfully' }
      } else {
        return { success: false, error: dataPowerCable.error, message: dataPowerCable.message }
      }
    }
  } catch (error: any) {
    console.error('Error retrieving Power Cable entity by ID:', error)
    return { success: false, error, message: 'Error retrieving Power Cable entity by ID' }
  }
}

export const deletePowerCableEntity: any = async (entity: any) => {
  try {
    await runAsync('BEGIN TRANSACTION')

    if (entity.attachment && entity.attachment.id) {
      const pathData = JSON.parse(entity.attachment.path || '[]')
      if (Array.isArray(pathData) && pathData.length > 0) {
        syncFilesWithDeletion(pathData, null, entity.asset.mrid)
      }
    }

    if (entity.assetPsr && entity.assetPsr.mrid) {
      await deleteAssetPsrTransaction(entity.assetPsr.mrid, db)
    }

    if (entity.concentricNeutral && entity.concentricNeutral.mrid) {
      const cableInfoId = entity.concentricNeutral.mrid
      await new Promise((res, rej) =>
        db.run('DELETE FROM old_cable_info WHERE cable_info_id=?', [cableInfoId], (err: any) =>
          err ? rej(err) : res(undefined)
        )
      )
      await new Promise((res, rej) =>
        db.run('DELETE FROM joint_cable_info WHERE cable_info_id=?', [cableInfoId], (err: any) =>
          err ? rej(err) : res(undefined)
        )
      )
      await new Promise((res, rej) =>
        db.run(
          'DELETE FROM terminal_cable_info WHERE cable_info_id=?',
          [cableInfoId],
          (err: any) => (err ? rej(err) : res(undefined))
        )
      )
      await new Promise((res, rej) =>
        db.run(
          'DELETE FROM sheath_voltage_limiter WHERE cable_info_id=?',
          [cableInfoId],
          (err: any) => (err ? rej(err) : res(undefined))
        )
      )
    }

    if (entity.asset && entity.asset.mrid) {
      await deleteAssetByIdTransaction(entity.asset.mrid, db)
    }

    if (entity.concentricNeutral && entity.concentricNeutral.mrid) {
      await deleteConcentricNeutralCableInfoTransaction(entity.concentricNeutral.mrid, db)
    }

    if (entity.productAssetModel && entity.productAssetModel.mrid) {
      await deleteProductAssetModelByIdTransaction(entity.productAssetModel.mrid, db)
    }
    if (entity.lifecycleDate && entity.lifecycleDate.mrid) {
      await deleteLifecycleDateByIdTransaction(entity.lifecycleDate.mrid, db)
    }

    for (const item of entity.temperature || [])
      await deleteUnitSafely(deleteTemperatureByIdTransaction, item.mrid, db)
    for (const item of entity.voltage || [])
      await deleteUnitSafely(deleteVoltageByIdTransaction, item.mrid, db)
    for (const item of entity.length || [])
      await deleteUnitSafely(deleteLengthByIdTransaction, item.mrid, db)
    for (const item of entity.frequency || [])
      await deleteUnitSafely(deleteFrequencyByIdTransaction, item.mrid, db)
    for (const item of entity.second || [])
      await deleteUnitSafely(deleteSecondsByIdTransaction, item.mrid, db)
    for (const item of entity.currentFlow || [])
      await deleteUnitSafely(deleteCurrentFlowByIdTransaction, item.mrid, db)
    for (const item of entity.area || [])
      await deleteUnitSafely(deleteAreaByIdTransaction, item.mrid, db)

    await runAsync('COMMIT')
    return { success: true, message: 'Power cable entity deleted successfully' }
  } catch (error: any) {
    await runAsync('ROLLBACK')
    console.error('Delete Power Cable Error:', error)
    return { success: false, error, message: 'Error deleting Power Cable entity' }
  }
}

const deleteUnitSafely: any = async (deleteFunc: any, id: string, dbsql: any) => {
  if (!id) return
  try {
    await deleteFunc(id, dbsql)
  } catch (error: any) {
    const isConstraintError = (errObj: any) => {
      return errObj && (errObj.code === 'SQLITE_CONSTRAINT' || errObj.errno === 19)
    }

    if (
      isConstraintError(error) ||
      isConstraintError(error.err) ||
      isConstraintError(error.error)
    ) {
      return
    }

    throw error
  }
}

const runAsync: any = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    const execute = (retries = 5) => {
      db.run(sql, params, function (err: any) {
        if (err) {
          if (err.code === 'SQLITE_BUSY' && retries > 0) {
            setTimeout(() => execute(retries - 1), 100)
          } else {
            reject(err)
          }
        } else {
          resolve(undefined)
        }
      })
    }
    execute()
  })
}
