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
  deleteDirectory
} from '@/function/entity/attachment'
import { insertVoltageTransaction, getVoltageByIds } from '@/function/cim/voltage'
import { insertCurrentFlowTransaction, getCurrentFlowByIds } from '@/function/cim/currentFlow'
import { insertLifecycleDateTransaction, getLifecycleDateById } from '@/function/cim/lifecycleDate'
import {
  insertProductAssetModelTransaction,
  getProductAssetModelById
} from '@/function/cim/productAssetModel'
import { insertAssetPsrTransaction, getAssetPsrByAssetIdAndPsrId } from '@/function/entity/assetPsr'
import { insertFrequencyTransaction, getFrequencyByIds } from '@/function/cim/frequency'
import { insertAssetTransaction, getAssetById } from '@/function/cim/asset'
import { insertCapacitorInfoTransaction, getCapacitorInfoById } from '@/function/cim/capacitorInfo'
import {
  insertCapacitanceCapacitorInfoTransaction,
  getCapacitanceCapacitorInfoByIds,
  deleteCapacitanceInfoTransaction
} from '@/function/cim/capacitanceInfo'
import {
  insertDissipationFactorCapacitorInfoTransaction,
  getDissipationFactorCapacitorInfoByIds,
  deleteDissipationFactorCapacitorInfoTransaction
} from '@/function/cim/dissipationFactorInfo'
import CapacitorEntity from '@/views/Flatten/Capacitor'
import { insertReactivePowerTransaction, getReactivePowerByIds } from '@/function/cim/reactivePower'
import {
  insertCapacitanceTransaction,
  getCapacitanceById,
  deleteCapacitanceByIdTransaction
} from '@/function/cim/capacitance'
import {
  insertPercentTransaction,
  getPercentById,
  deletePercentByIdTransaction
} from '@/function/cim/percent'
import { insertMassTransaction, getMassById } from '@/function/cim/mass'

const isUsedInTable = async (table: string, column: string, id: string, dbsql: any) => {
  return new Promise((resolve, reject) => {
    dbsql.get(`SELECT 1 FROM ${table} WHERE ${column} = ?`, [id], (err: any, row: any) => {
      if (err) reject(err)
      else resolve(!!row)
    })
  })
}

export const insertCapacitorEntity: any = async (old_entity: any, entity: any) => {
  try {
    if (entity.asset.mrid === null || entity.asset.mrid === '') {
      return {
        success: false,
        error: new Error('MRID is required for Capacitor Entity'),
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
          error: new Error('MRID is required for Rotating Machine Entity'),
          message: ''
        }
      }
      await runAsync('BEGIN TRANSACTION')

      if (old_entity && old_entity.capacitor && entity.capacitor) {
        const oldPhase = old_entity.capacitor.phase_number
        const newPhase = entity.capacitor.phase_number

        if (oldPhase !== newPhase) {
          if (
            old_entity.capacitanceCapacitorInfo &&
            old_entity.capacitanceCapacitorInfo.length > 0
          ) {
            for (const oldCapInfo of old_entity.capacitanceCapacitorInfo) {
              if (oldCapInfo.mrid) {
                await deleteCapacitanceInfoTransaction(oldCapInfo.mrid, db)
              }
              if (oldCapInfo.value) {
                await deleteCapacitanceByIdTransaction(oldCapInfo.value, db)
              }
            }
          }

          if (
            old_entity.dissipationFactorCapacitorInfo &&
            old_entity.dissipationFactorCapacitorInfo.length > 0
          ) {
            for (const oldDfInfo of old_entity.dissipationFactorCapacitorInfo) {
              if (oldDfInfo.mrid) {
                await deleteDissipationFactorCapacitorInfoTransaction(oldDfInfo.mrid, db)
              }
              if (oldDfInfo.value) {
                await deletePercentByIdTransaction(oldDfInfo.value, db)
              }
            }
          }
        }
      }

      for (const currentFlow of entity.currentFlow) {
        if (currentFlow.mrid) {
          await insertCurrentFlowTransaction(currentFlow, db)
        }
      }

      for (const frequency of entity.frequency) {
        if (frequency.mrid) {
          await insertFrequencyTransaction(frequency, db)
        }
      }

      for (const voltage of entity.voltage) {
        if (voltage.mrid) {
          await insertVoltageTransaction(voltage, db)
        }
      }

      for (const reactivePower of entity.reactivePower) {
        if (reactivePower.mrid) {
          await insertReactivePowerTransaction(reactivePower, db)
        }
      }

      for (const capacitance of entity.capacitance) {
        if (capacitance.mrid) {
          await insertCapacitanceTransaction(capacitance, db)
        }
      }

      for (const mass of entity.mass) {
        if (mass.mrid) {
          await insertMassTransaction(mass, db)
        }
      }

      for (const percent of entity.percent) {
        if (percent.mrid) {
          await insertPercentTransaction(percent, db)
        }
      }
      await insertCapacitorInfoTransaction(entity.capacitor, db)

      for (const capacitanceInfo of entity.capacitanceCapacitorInfo) {
        if (capacitanceInfo.mrid) {
          await insertCapacitanceCapacitorInfoTransaction(capacitanceInfo, db)
        }
      }

      for (const dissipationFactorInfo of entity.dissipationFactorCapacitorInfo) {
        if (dissipationFactorInfo.mrid) {
          await insertDissipationFactorCapacitorInfoTransaction(dissipationFactorInfo, db)
        }
      }

      await insertLifecycleDateTransaction(entity.lifecycleDate, db)

      await insertProductAssetModelTransaction(entity.productAssetModel, db)

      await insertAssetTransaction(entity.asset, db)

      if (entity.assetPsr && entity.assetPsr.psr_id) {
        await insertAssetPsrTransaction(entity.assetPsr, db)
      }

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
      return { success: true, data: entity, message: 'Capacitor entity inserted successfully' }
    }
  } catch (error: any) {
    restoreFiles(null, null, entity.asset.mrid)
    deleteBackupFiles(null, entity.asset.mrid)
    console.error('Error saving Capacitor entity:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      entity: JSON.stringify(entity, null, 2)
    })
    await runAsync('ROLLBACK')
    return {
      success: false,
      error,
      message: `Error saving Capacitor entity: ${error.message || 'Unknown error'}`
    }
  }
}

export const getCapacitorEntity: any = async (id: string, psrId: string) => {
  try {
    if (id == null || id === '') {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      const entity = new CapacitorEntity()
      const dataCapacitor: any = await getAssetById(id)
      if (dataCapacitor.success) {
        entity.asset = dataCapacitor.data

        const dataProductAssetModel: any = await getProductAssetModelById(
          entity.asset.product_asset_model
        )
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

        const dataCapacitorInfo: any = await getCapacitorInfoById(entity.asset.asset_info)
        if (dataCapacitorInfo.success) {
          entity.capacitor = dataCapacitorInfo.data
        }

        const dataCapacitanceCapacitorInfo: any = await getCapacitanceCapacitorInfoByIds([
          entity.asset.asset_info
        ])
        if (dataCapacitanceCapacitorInfo.success) {
          entity.capacitanceCapacitorInfo = dataCapacitanceCapacitorInfo.data
        }

        const dataDissipationFactorCapacitorInfo: any =
          await getDissipationFactorCapacitorInfoByIds([entity.asset.asset_info])
        if (dataDissipationFactorCapacitorInfo.success) {
          entity.dissipationFactorCapacitorInfo = dataDissipationFactorCapacitorInfo.data
        }

        const dataLifecycleDate: any = await getLifecycleDateById(entity.asset.lifecycle_date)
        if (dataLifecycleDate.success) {
          entity.lifecycleDate = dataLifecycleDate.data
        }

        const capacitor_arr: any = {
          voltage: ['rated_voltage'],
          currentFlow: ['rated_current'],
          frequency: ['rated_frequency'],
          reactivePower: ['rated_power'],
          mass: ['weight']
        }

        let voltage: any[] = []
        let currentFlow: any[] = []
        let frequency: any[] = []
        let reactivePower: any[] = []
        let capacitance: any[] = []
        let mass: any[] = []
        let percent: any[] = []

        for (const key in capacitor_arr) {
          for (const item of capacitor_arr[key]) {
            if (entity.capacitor[item]) {
              switch (key) {
                case 'voltage':
                  voltage.push(entity.capacitor[item])
                  break
                case 'currentFlow':
                  currentFlow.push(entity.capacitor[item])
                  break
                case 'frequency':
                  frequency.push(entity.capacitor[item])
                  break
                case 'reactivePower':
                  reactivePower.push(entity.capacitor[item])
                  break
                case 'mass':
                  mass.push(entity.capacitor[item])
                  break
              }
            }
          }
        }

        for (const capInfo of entity.capacitanceCapacitorInfo) {
          if (capInfo.value) {
            const capacitanceObj = {
              mrid: capInfo.mrid,
              valueId: capInfo.value,
              phase: capInfo.phase || '1'
            }
            capacitance.push(capacitanceObj)
          }
        }

        for (const dfInfo of entity.dissipationFactorCapacitorInfo) {
          if (dfInfo.value) {
            const percentObj = {
              mrid: dfInfo.mrid,
              valueId: dfInfo.value,
              phase: dfInfo.phase || '1'
            }
            percent.push(percentObj)
          }
        }

        if (voltage.length > 0) {
          const dataVoltage: any = await getVoltageByIds(voltage)
          if (dataVoltage.success) {
            entity.voltage = dataVoltage.data
          }
        }

        if (currentFlow.length > 0) {
          const dataCurrentFlow: any = await getCurrentFlowByIds(currentFlow)
          if (dataCurrentFlow.success) {
            entity.currentFlow = dataCurrentFlow.data
          }
        }

        if (frequency.length > 0) {
          const dataFrequency: any = await getFrequencyByIds(frequency)
          if (dataFrequency.success) {
            entity.frequency = dataFrequency.data
          }
        }

        if (reactivePower.length > 0) {
          const dataReactivePower: any = await getReactivePowerByIds(reactivePower)
          if (dataReactivePower.success) {
            entity.reactivePower = dataReactivePower.data
          }
        }

        if (capacitance.length > 0) {
          const capacitanceData: any[] = []
          for (const capObj of capacitance) {
            const dataCapacitance: any = await getCapacitanceById(capObj.valueId)
            if (dataCapacitance.success) {
              const capacitanceWithPhase = {
                ...dataCapacitance.data,
                phase: capObj.phase,
                capacitanceCapacitorInfo_mrid: capObj.mrid
              }
              capacitanceData.push(capacitanceWithPhase)
            }
          }
          entity.capacitance = capacitanceData
        }

        if (mass.length > 0) {
          const massData: any[] = []
          for (const massId of mass) {
            const dataMass: any = await getMassById(massId)
            if (dataMass.success) {
              massData.push(dataMass.data)
            }
          }
          entity.mass = massData
        }

        if (percent.length > 0) {
          const percentData: any[] = []
          for (const percentObj of percent) {
            const dataPercent: any = await getPercentById(percentObj.valueId)
            if (dataPercent.success) {
              const percentWithPhase = {
                ...dataPercent.data,
                phase: percentObj.phase,
                dissipationFactorCapacitorInfo_mrid: percentObj.mrid
              }
              percentData.push(percentWithPhase)
            }
          }
          entity.percent = percentData
        }

        return {
          success: true,
          data: entity,
          message: 'Capacitor entity retrieved successfully'
        }
      } else {
        return { success: false, error: dataCapacitor.error, message: dataCapacitor.message }
      }
    }
  } catch (error) {
    console.error('Error retrieving Capacitor entity by ID:', error)
    return { success: false, error, message: 'Error retrieving Capacitor entity by ID' }
  }
}

export const deleteCapacitorEntity: any = async (entity: any) => {
  try {
    await runAsync('BEGIN TRANSACTION')

    if (entity.attachment && entity.attachment.id) {
      await runAsync('DELETE FROM attachment WHERE id=?', [entity.attachment.id])
      if (entity.asset && entity.asset.mrid) {
        const dirPath = path.join(attachmentContext.getAttachmentDir(), entity.asset.mrid)
        await deleteDirectory(dirPath)
      }
    }

    if (entity.assetPsr && entity.assetPsr.mrid) {
      await runAsync('DELETE FROM asset_psr WHERE mrid=?', [entity.assetPsr.mrid])
    }

    if (entity.asset && entity.asset.mrid) {
      await runAsync('DELETE FROM asset WHERE mrid=?', [entity.asset.mrid])
    }

    for (const df of entity.dissipationFactorCapacitorInfo || []) {
      if (df.mrid) {
        await runAsync('DELETE FROM dissipation_factor_capacitor_info WHERE mrid=?', [df.mrid])
      }
    }

    for (const cap of entity.capacitanceCapacitorInfo || []) {
      if (cap.mrid) {
        await runAsync('DELETE FROM capacitance_capacitor_info WHERE mrid=?', [cap.mrid])
      }
    }

    if (entity.capacitor && entity.capacitor.mrid) {
      const isUsed = await isUsedInTable('Asset', 'asset_info', entity.capacitor.mrid, db)
      if (!isUsed) {
        await runAsync('DELETE FROM capacitor_info WHERE mrid=?', [entity.capacitor.mrid])
        await runAsync('DELETE FROM asset_info WHERE mrid=?', [entity.capacitor.mrid])
        await runAsync('DELETE FROM identified_object WHERE mrid=?', [entity.capacitor.mrid])
      } else {
        console.warn(
          `Skipping delete Capacitor Info: Used by other assets (${entity.capacitor.mrid})`
        )
      }
    }

    if (entity.productAssetModel && entity.productAssetModel.mrid) {
      const isUsed = await isUsedInTable(
        'Asset',
        'product_asset_model',
        entity.productAssetModel.mrid,
        db
      )
      if (!isUsed) {
        await runAsync('DELETE FROM product_asset_model WHERE mrid=?', [
          entity.productAssetModel.mrid
        ])
        await runAsync('DELETE FROM identified_object WHERE mrid=?', [
          entity.productAssetModel.mrid
        ])
      } else {
        console.warn(
          `Skipping delete ProductAssetModel: Used by other assets (${entity.productAssetModel.mrid})`
        )
      }
    }

    if (entity.lifecycleDate && entity.lifecycleDate.mrid) {
      const isUsed = await isUsedInTable('Asset', 'lifecycle_date', entity.lifecycleDate.mrid, db)
      if (!isUsed) {
        await runAsync('DELETE FROM lifecycle_date WHERE mrid=?', [entity.lifecycleDate.mrid])
      } else {
        console.warn(
          `Skipping delete LifecycleDate: Used by other assets (${entity.lifecycleDate.mrid})`
        )
      }
    }

    const safeDeleteRaw = async (table: string, id: string) => {
      try {
        await runAsync(`DELETE FROM ${table} WHERE mrid=?`, [id])
      } catch (error: any) {
        if (error && error.code === 'SQLITE_CONSTRAINT') {
          console.warn(`Skipping delete ${table} (${id}): Used by other entities.`)
        } else {
          throw error
        }
      }
    }

    for (const p of entity.percent || []) {
      if (p.mrid) await safeDeleteRaw('percent', p.mrid)
    }

    for (const m of entity.mass || []) {
      if (m.mrid) await safeDeleteRaw('mass', m.mrid)
    }

    for (const c of entity.capacitance || []) {
      if (c.mrid) await safeDeleteRaw('capacitance', c.mrid)
    }

    for (const rp of entity.reactivePower || []) {
      if (rp.mrid) await safeDeleteRaw('reactive_power', rp.mrid)
    }

    for (const v of entity.voltage || []) {
      if (v.mrid) await safeDeleteRaw('voltage', v.mrid)
    }

    for (const f of entity.frequency || []) {
      if (f.mrid) await safeDeleteRaw('frequency', f.mrid)
    }

    for (const cf of entity.currentFlow || []) {
      if (cf.mrid) await safeDeleteRaw('current_flow', cf.mrid)
    }

    await runAsync('COMMIT')
    return { success: true, message: 'Capacitor entity deleted successfully' }
  } catch (error: any) {
    await runAsync('ROLLBACK')
    console.error('Error deleting Capacitor entity:', error)
    return { success: false, error, message: 'Error deleting Capacitor entity' }
  }
}

const runAsync = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err: any) {
      if (err) reject(err)
      else resolve(undefined)
    })
  })
}
