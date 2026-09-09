import db from '../../datacontext/index'
import path from 'path'
import * as attachmentContext from '../../attachmentcontext/index'
import circuitBreakerEntity from '@/views/Flatten/CircuitBreaker'
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
  insertVoltageTransaction,
  getVoltageByIds,
  deleteVoltageByIdTransaction
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
  insertFrequencyTransaction,
  deleteFrequencyByIdTransaction,
  getFrequencyByIds
} from '@/function/cim/frequency'
import {
  insertAssetTransaction,
  getAssetById,
  deleteAssetByIdTransaction
} from '@/function/cim/asset'
import {
  insertResistanceTransaction,
  deleteResistanceByIdTransaction,
  getResistanceByIds
} from '@/function/cim/resistance'
import {
  insertLengthTransaction,
  deleteLengthByIdTransaction,
  getLengthByIds
} from '@/function/cim/length'
import { insertMassTransaction, deleteMassByIdTransaction, getMassByIds } from '@/function/cim/mass'
import {
  insertVolumeTransaction,
  deleteVolumeByIdTransaction,
  getVolumeByIds
} from '@/function/cim/volume'
import {
  insertPressureTransaction,
  deletePressureByIdTransaction,
  getPressureByIds
} from '@/function/cim/pressure'
import {
  insertTemperatureTransaction,
  deleteTemperatureByIdTransaction,
  getTemperatureByIds
} from '@/function/cim/temperature'
import {
  insertQuantityValueTransaction,
  deleteQuantityValueTransaction,
  getQuantityValueByIds
} from '@/function/cim/quantityValue'
import {
  insertCapacitanceTransaction,
  deleteCapacitanceByIdTransaction,
  getCapacitanceByIds
} from '@/function/cim/capacitance'
import {
  insertSecondsTransaction,
  deleteSecondsByIdTransaction,
  getSecondByIds
} from '@/function/cim/seconds'
import {
  insertActivePowerTransaction,
  deleteActivePowerByIdTransaction,
  getActivePowerByIds
} from '@/function/cim/activePower'
import {
  insertOldBreakerInfoTransaction,
  getOldBreakerInfoById,
  deleteOldBreakerInfoTransaction
} from '@/function/cim/oldBreakerInfo'
import {
  insertBreakerContactSystemInfoTransaction,
  deleteBreakerContactSystemInfoTransaction,
  getBreakerContactSystemInfoByBreakerInfoId
} from '@/function/cim/breakerContactSystemInfo'
import {
  insertBreakerRatingInfoTransaction,
  deleteBreakerRatingInfoTransaction,
  getBreakerRatingInfoByBreakerInfoId
} from '@/function/cim/breakerRatingInfo'
import {
  insertBreakerOtherInfoTransaction,
  deleteBreakerOtherInfoTransaction,
  getBreakerOtherInfoByBreakerInfoId
} from '@/function/cim/breakerOtherInfo'
import {
  insertOldOperatingMechanismTransaction,
  getOldOperatingMechanismByAssetIdTransaction,
  deleteOldOperatingMechanismTransaction
} from '@/function/cim/oldOperatingMechanism'
import {
  insertOldOperatingMechanismInfoTransaction,
  deleteOldOperatingMechanismInfoTransaction,
  getOldOperatingMechanismInfoById
} from '@/function/cim/oldOperatingMechanismInfo'
import {
  insertOperatingMechanismComponentTransaction,
  deleteOperatingMechanismComponentTransaction,
  getOperatingMechanismComponentByOperatingMechanismId
} from '@/function/cim/operatingMechanismComponent'
import {
  insertAssessmentLimitBreakerInfoTransaction,
  getAssessmentLimitBreakerInfoByBreakerInfoId,
  deleteAssessmentLimitBreakerInfoTransaction
} from '@/function/cim/assessmentLimitBreakerInfo'
import {
  insertAuxiliaryContactsBreakerInfoTransaction,
  getAuxiliaryContactsBreakerInfoByAssessmentLimitId,
  deleteAuxiliaryContactsBreakerInfoTransaction
} from '@/function/cim/auxiliaryContactsBreakerInfo'
import {
  insertTripOperationTransaction,
  getTripOperationByAuxiliaryContactsId,
  deleteTripOperationTransaction
} from '@/function/cim/tripOperation'
import {
  insertCloseOperationTransaction,
  getCloseOperationByAuxiliaryContactsId,
  deleteCloseOperationTransaction
} from '@/function/cim/closeOperation'
import {
  insertContactResistanceBreakerInfoTransaction,
  getContactResistanceBreakerInfoByAssessmentLimitBreakerInfoId,
  deleteContactResistanceBreakerInfoTransaction
} from '@/function/cim/contactResistanceBreakerInfo'
import {
  insertOperatingTimeBreakerInfoTransaction,
  getOperatingTimeBreakerInfoByAssessmentLimitBreakerInfoId,
  deleteOperatingTimeBreakerInfoTransaction
} from '@/function/cim/operatingTimeBreakerInfo'
import {
  insertContactTravelBreakerInfoTransaction,
  getContactTravelBreakerInfoByAssessmentLimitBreakerInfoId,
  deleteContactTravelBreakerInfoTransaction
} from '@/function/cim/contactTravelBreakerInfo'
import {
  insertMiscellaneousBreakerInfoTransaction,
  getMiscellaneousBreakerInfoByAssessmentLimitId,
  deleteMiscellaneousBreakerInfoTransaction
} from '@/function/cim/miscellaneousBreakerInfo'
import {
  insertCoilCharacteristicsBreakerInfoTransaction,
  getCoilCharacteristicsBreakerInfoByAssessmentLimitId,
  deleteCoilCharacteristicsBreakerInfoTransaction
} from '@/function/cim/coilCharacteristicsBreakerInfo'
import {
  insertPickupVoltageBreakerInfoTransaction,
  getPickupVoltageBreakerInfoByAssessmentLimitId,
  deletePickupVoltageBreakerInfoTransaction
} from '@/function/cim/pickupVoltageBreakerInfo'
import {
  insertMotorCharacteristicsBreakerInfoTransaction,
  getMotorCharacteristicsBreakerInfoByAssessmentLimitId,
  deleteMotorCharacteristicsBreakerInfoTransaction
} from '@/function/cim/motorCharacteristicsBreakerInfo'
import {
  insertUnderVoltageReleaseBreakerInfoTransaction,
  getUnderVoltageReleaseBreakerInfoByAssessmentLimitId,
  deleteUnderVoltageReleaseBreakerInfoTransaction
} from '@/function/cim/underVoltageReleaseBreakerInfo'
import {
  insertOvercurrentReleaseBreakerInfoTransaction,
  getOvercurrentReleaseBreakerInfoByAssessmentLimitId,
  deleteOvercurrentReleaseBreakerInfoTransaction
} from '@/function/cim/overcurrentReleaseBreakerInfo'

export const insertBreakerEntity: any = async (old_entity: any, entity: any) => {
  const unitTypes = [
    'resistance',
    'capacitance',
    'voltage',
    'currentFlow',
    'second',
    'activePower',
    'length',
    'mass',
    'volume',
    'temperature',
    'frequency',
    'quantity',
    'pressure'
  ]
  const tableTypes = [
    'operatingMechanismComponent',
    'contactResistanceBreakerInfo',
    'operatingTimeBreakerInfo',
    'contactTravelBreakerInfo',
    'tripOperation',
    'closeOperation',
    'miscellaneousBreakerInfo',
    'coilCharacteristicsBreakerInfo',
    'pickupVoltageBreakerInfo',
    'motorCharacteristicsBreakerInfo',
    'underVoltageReleaseBreakerInfo',
    'overcurrentReleaseBreakerInfo'
  ]
  try {
    if (entity.asset.mrid === null || entity.asset.mrid === '') {
      return {
        success: false,
        error: new Error('MRID is required for circuit breaker Entity'),
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
          error: new Error('MRID is required for circuit breaker Entity'),
          message: ''
        }
      }
      await runAsync('BEGIN TRANSACTION')

      const toDeleteUnit: any = {}
      for (const unitType of unitTypes) {
        const newIds = entity[unitType].map((v: any) => v.mrid).filter((id: any) => id)
        const oldIds = old_entity[unitType].map((v: any) => v.mrid).filter((id: any) => id)

        const toAdd = entity[unitType].filter((v: any) => v.mrid && !oldIds.includes(v.mrid))
        const toDelete = old_entity[unitType].filter((v: any) => v.mrid && !newIds.includes(v.mrid))
        toDeleteUnit[unitType] = toDelete
        const toUpdate = entity[unitType].filter((v: any) => v.mrid && oldIds.includes(v.mrid))
        for (const unit of toAdd) {
          await insertUnit(unitType, unit, db)
        }
        for (const unit of toUpdate) {
          await insertUnit(unitType, unit, db)
        }
      }

      await insertLifecycleDateTransaction(entity.lifecycleDate, db)
      await insertLifecycleDateTransaction(entity.operatingLifecycleDate, db)

      await insertProductAssetModelTransaction(entity.productAssetModel, db)
      await insertProductAssetModelTransaction(entity.operatingProductAssetModel, db)

      await insertOldBreakerInfoTransaction(entity.oldBreakerInfo, db)

      try {
        let assetResult: any = await insertAssetTransaction(entity.asset, db)

        if (
          !assetResult.success &&
          assetResult.err &&
          assetResult.err.code === 'SQLITE_CONSTRAINT'
        ) {
          const _oldLocation: any = entity.asset.location
          void _oldLocation
          entity.asset.location = null

          assetResult = await insertAssetTransaction(entity.asset, db)

          if (assetResult.success) {
          } else {
            console.error('[DEBUG] Retry Insert Asset also FAILED:', assetResult.err)
            throw new Error(
              `Critical: Failed to insert Asset even with NULL location. Error: ${assetResult.err.message}`
            )
          }
        } else if (!assetResult.success) {
          throw new Error(`Insert Asset failed: ${assetResult.message}`)
        }
      } catch (err: any) {
        console.error('[DEBUG] Critical Exception during Asset Insert:', err)
        throw err
      }

      try {
        await runAsync('SAVEPOINT sp_insert_asset_psr')
        await insertAssetPsrTransaction(entity.assetPsr, db)
        await runAsync('RELEASE SAVEPOINT sp_insert_asset_psr')
      } catch (err: any) {
        await runAsync('ROLLBACK TO SAVEPOINT sp_insert_asset_psr')
        console.warn(
          'Warning: Failed to insert AssetPsr link (likely due to missing Parent PSR in DB). Proceeding with orphaned asset.',
          err.message
        )
      }

      await insertBreakerRatingInfoTransaction(entity.breakerRatingInfo, db)

      await insertBreakerContactSystemInfoTransaction(entity.breakerContactSystemInfo, db)

      await insertBreakerOtherInfoTransaction(entity.breakerOtherInfo, db)

      await insertOldOperatingMechanismInfoTransaction(entity.oldOperatingMechanismInfo, db)

      await insertOldOperatingMechanismTransaction(entity.oldOperatingMechanism, db)

      for (const component of entity.operatingMechanismComponent) {
        await insertOperatingMechanismComponentTransaction(component, db)
      }

      await insertAssessmentLimitBreakerInfoTransaction(entity.assessmentLimitBreakerInfo, db)

      await insertAuxiliaryContactsBreakerInfoTransaction(entity.auxiliaryContactsBreakerInfo, db)

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
        const toDelete = old_entity[tableType].filter(
          (v: any) => v.mrid && !newIds.includes(v.mrid)
        )
        toDeleteTable[tableType] = toDelete
        const toUpdate = entity[tableType].filter((v: any) => v.mrid && oldIds.includes(v.mrid))
        for (const table of toAdd) {
          await insertTable(tableType, table, db)
        }
        for (const table of toUpdate) {
          await insertTable(tableType, table, db)
        }
      }

      for (const tableType of tableTypes) {
        for (const t of toDeleteTable[tableType]) {
          await deleteTable(tableType, t.mrid, db)
        }
      }

      for (const unitType of unitTypes) {
        for (const u of toDeleteUnit[unitType]) {
          await deleteUnit(unitType, u.mrid, db)
        }
      }

      await runAsync('COMMIT')
      deleteBackupFiles(null, entity.asset.mrid)
      return { success: true, data: entity, message: 'Breaker entity inserted successfully' }
    }
  } catch (error: any) {
    restoreFiles(null, null, entity.asset.mrid)
    deleteBackupFiles(null, entity.asset.mrid)
    await runAsync('ROLLBACK')
    console.error(error)
    return {
      success: false,
      error,
      message: `Error saving breaker entity: ${error.message || 'Unknown error'}`
    }
  }
}

export const getBreakerEntity: any = async (id: string, psrId: string) => {
  try {
    if (id == null || id === '') {
      return { success: false, error: new Error('Invalid ID') }
    } else {
      let resistanceIds: any[] = []
      let capacitanceIds: any[] = []
      let voltageIds: any[] = []
      let currentFlowIds: any[] = []
      let secondIds: any[] = []
      let activePowerIds: any[] = []
      let lengthIds: any[] = []
      let massIds: any[] = []
      let volumeIds: any[] = []
      let temperatureIds: any[] = []
      let frequencyIds: any[] = []
      let quantityIds: any[] = []
      let pressureIds: any[] = []

      const entity = new circuitBreakerEntity()
      const dataBreaker: any = await getAssetById(id)
      if (dataBreaker.success) {
        entity.asset = dataBreaker.data
        const dataAssetPsr: any = await getAssetPsrByAssetIdAndPsrId(entity.asset.mrid, psrId)
        if (dataAssetPsr.success && dataAssetPsr.data) {
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

        const dataOldBreakerInfo: any = await getOldBreakerInfoById(entity.asset.asset_info)
        if (dataOldBreakerInfo.success) {
          entity.oldBreakerInfo = dataOldBreakerInfo.data
        }

        if (entity.oldBreakerInfo && entity.oldBreakerInfo.product_asset_model) {
          const productAssetModelId = entity.oldBreakerInfo.product_asset_model
          const dataProductAssetModel: any = await getProductAssetModelById(productAssetModelId)
          if (dataProductAssetModel.success) {
            entity.productAssetModel = dataProductAssetModel.data
          }
        }

        if (entity.oldBreakerInfo) {
          if (entity.oldBreakerInfo.pir_value) resistanceIds.push(entity.oldBreakerInfo.pir_value)
          if (entity.oldBreakerInfo.capacitor_value)
            capacitanceIds.push(entity.oldBreakerInfo.capacitor_value)
          if (entity.oldBreakerInfo.rated_frequency)
            frequencyIds.push(entity.oldBreakerInfo.rated_frequency)
          if (entity.oldBreakerInfo.rated_voltage)
            voltageIds.push(entity.oldBreakerInfo.rated_voltage)
          if (entity.oldBreakerInfo.rated_current)
            currentFlowIds.push(entity.oldBreakerInfo.rated_current)
        }

        if (entity.oldBreakerInfo && entity.oldBreakerInfo.mrid) {
          const dataBreakerRatingInfo: any = await getBreakerRatingInfoByBreakerInfoId(
            entity.oldBreakerInfo.mrid
          )
          if (dataBreakerRatingInfo.success) {
            entity.breakerRatingInfo = dataBreakerRatingInfo.data
            currentFlowIds.push(entity.breakerRatingInfo.rated_short_circuit_breaking_current)
            activePowerIds.push(entity.breakerRatingInfo.rated_power_opening)
            activePowerIds.push(entity.breakerRatingInfo.rated_power_closing)
            secondIds.push(entity.breakerRatingInfo.short_circuit_nominal_duration)
            activePowerIds.push(entity.breakerRatingInfo.rated_power_motor_charge)
            voltageIds.push(entity.breakerRatingInfo.rated_insulation_level)
          }
          secondIds.push(entity.oldBreakerInfo.rated_interrupting_time)

          const dataBreakerContactSystemInfo: any =
            await getBreakerContactSystemInfoByBreakerInfoId(entity.oldBreakerInfo.mrid)
          if (dataBreakerContactSystemInfo.success) {
            entity.breakerContactSystemInfo = dataBreakerContactSystemInfo.data
            secondIds.push(entity.breakerContactSystemInfo.damping_time)
            lengthIds.push(entity.breakerContactSystemInfo.nominal_total_travel)
            lengthIds.push(entity.breakerContactSystemInfo.nozzle_length)
          }

          const dataBreakerOtherInfo: any = await getBreakerOtherInfoByBreakerInfoId(
            entity.oldBreakerInfo.mrid
          )
          if (dataBreakerOtherInfo.success) {
            entity.breakerOtherInfo = dataBreakerOtherInfo.data
            pressureIds.push(entity.breakerOtherInfo.rated_gas_pressure)
            massIds.push(entity.breakerOtherInfo.weight_of_gas)
            massIds.push(entity.breakerOtherInfo.total_weight_with_gas)
            volumeIds.push(entity.breakerOtherInfo.volume_of_gas)
            temperatureIds.push(entity.breakerOtherInfo.rated_gas_temperature)
          }

          const dataAssessmentLimitBreakerInfo: any =
            await getAssessmentLimitBreakerInfoByBreakerInfoId(entity.oldBreakerInfo.mrid)
          if (dataAssessmentLimitBreakerInfo.success) {
            entity.assessmentLimitBreakerInfo = dataAssessmentLimitBreakerInfo.data

            const dataAuxiliaryContactsBreakerInfo: any =
              await getAuxiliaryContactsBreakerInfoByAssessmentLimitId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataAuxiliaryContactsBreakerInfo.success && dataAuxiliaryContactsBreakerInfo.data) {
              entity.auxiliaryContactsBreakerInfo = Array.isArray(
                dataAuxiliaryContactsBreakerInfo.data
              )
                ? dataAuxiliaryContactsBreakerInfo.data[0]
                : dataAuxiliaryContactsBreakerInfo.data

              if (entity.auxiliaryContactsBreakerInfo) {
                const dataTripOperation: any = await getTripOperationByAuxiliaryContactsId(
                  entity.auxiliaryContactsBreakerInfo.mrid
                )
                if (dataTripOperation.success) {
                  entity.tripOperation = dataTripOperation.data
                  for (const trip of entity.tripOperation) {
                    secondIds.push(trip.t_min)
                    secondIds.push(trip.t_max)
                    secondIds.push(trip.t_ref)
                    secondIds.push(trip.t_dev)
                  }
                }

                const dataCloseOperation: any = await getCloseOperationByAuxiliaryContactsId(
                  entity.auxiliaryContactsBreakerInfo.mrid
                )
                if (dataCloseOperation.success) {
                  entity.closeOperation = dataCloseOperation.data
                  for (const close of entity.closeOperation) {
                    secondIds.push(close.t_min)
                    secondIds.push(close.t_max)
                    secondIds.push(close.t_ref)
                    secondIds.push(close.t_dev)
                  }
                }
              }
            }

            const dataContactResistance: any =
              await getContactResistanceBreakerInfoByAssessmentLimitBreakerInfoId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataContactResistance.success) {
              entity.contactResistanceBreakerInfo = dataContactResistance.data
              for (const resistance of entity.contactResistanceBreakerInfo) {
                resistanceIds.push(resistance.r_min)
                resistanceIds.push(resistance.r_max)
                resistanceIds.push(resistance.r_ref)
                resistanceIds.push(resistance.r_dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch contactResistanceBreakerInfo')
            }

            const dataOperatingTime: any =
              await getOperatingTimeBreakerInfoByAssessmentLimitBreakerInfoId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataOperatingTime.success) {
              entity.operatingTimeBreakerInfo = dataOperatingTime.data
              for (const time of entity.operatingTimeBreakerInfo) {
                secondIds.push(time.t_min)
                secondIds.push(time.t_max)
                secondIds.push(time.t_ref)
                secondIds.push(time.t_dev_position)
                secondIds.push(time.t_dev_negative)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch operatingTimeBreakerInfo')
            }

            const dataContactTravel: any =
              await getContactTravelBreakerInfoByAssessmentLimitBreakerInfoId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataContactTravel.success) {
              entity.contactTravelBreakerInfo = dataContactTravel.data
              for (const travel of entity.contactTravelBreakerInfo) {
                lengthIds.push(travel.d_min)
                lengthIds.push(travel.d_max)
                lengthIds.push(travel.d_ref)
                lengthIds.push(travel.d_dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch contactTravelBreakerInfo')
            }

            const dataMiscellaneous: any = await getMiscellaneousBreakerInfoByAssessmentLimitId(
              entity.assessmentLimitBreakerInfo.mrid
            )
            if (dataMiscellaneous.success) {
              entity.miscellaneousBreakerInfo = dataMiscellaneous.data
              for (const misc of entity.miscellaneousBreakerInfo) {
                quantityIds.push(misc.min)
                quantityIds.push(misc.max)
                quantityIds.push(misc.ref)
                quantityIds.push(misc.dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch miscellaneousBreakerInfo')
            }

            const dataCoilCharacteristics: any =
              await getCoilCharacteristicsBreakerInfoByAssessmentLimitId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataCoilCharacteristics.success) {
              entity.coilCharacteristicsBreakerInfo = dataCoilCharacteristics.data
              for (const coil of entity.coilCharacteristicsBreakerInfo) {
                quantityIds.push(coil.min)
                quantityIds.push(coil.max)
                quantityIds.push(coil.ref)
                quantityIds.push(coil.dev_positive)
                quantityIds.push(coil.dev_negative)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch coilCharacteristicsBreakerInfo')
            }

            const dataPickupVoltage: any = await getPickupVoltageBreakerInfoByAssessmentLimitId(
              entity.assessmentLimitBreakerInfo.mrid
            )
            if (dataPickupVoltage.success) {
              entity.pickupVoltageBreakerInfo = dataPickupVoltage.data
              for (const pickup of entity.pickupVoltageBreakerInfo) {
                voltageIds.push(pickup.v_min)
                voltageIds.push(pickup.v_max)
                voltageIds.push(pickup.v_ref)
                voltageIds.push(pickup.v_dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch pickupVoltageBreakerInfo')
            }

            const dataMotorCharacteristics: any =
              await getMotorCharacteristicsBreakerInfoByAssessmentLimitId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataMotorCharacteristics.success) {
              entity.motorCharacteristicsBreakerInfo = dataMotorCharacteristics.data
              for (const motor of entity.motorCharacteristicsBreakerInfo) {
                quantityIds.push(motor.min)
                quantityIds.push(motor.max)
                quantityIds.push(motor.ref)
                quantityIds.push(motor.dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch motorCharacteristicsBreakerInfo')
            }

            const dataUnderVoltage: any =
              await getUnderVoltageReleaseBreakerInfoByAssessmentLimitId(
                entity.assessmentLimitBreakerInfo.mrid
              )
            if (dataUnderVoltage.success) {
              entity.underVoltageReleaseBreakerInfo = dataUnderVoltage.data
              for (const under of entity.underVoltageReleaseBreakerInfo) {
                voltageIds.push(under.min)
                voltageIds.push(under.max)
                voltageIds.push(under.ref)
                voltageIds.push(under.dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch underVoltageReleaseBreakerInfo')
            }

            const dataOvercurrent: any = await getOvercurrentReleaseBreakerInfoByAssessmentLimitId(
              entity.assessmentLimitBreakerInfo.mrid
            )
            if (dataOvercurrent.success) {
              entity.overcurrentReleaseBreakerInfo = dataOvercurrent.data
              for (const over of entity.overcurrentReleaseBreakerInfo) {
                currentFlowIds.push(over.min)
                currentFlowIds.push(over.max)
                currentFlowIds.push(over.ref)
                currentFlowIds.push(over.dev)
              }
            } else {
              console.warn('[DEBUG] Failed to fetch overcurrentReleaseBreakerInfo')
            }
          }
        }

        const dataOldOperatingMechanism: any = await getOldOperatingMechanismByAssetIdTransaction(
          entity.asset.mrid
        )
        if (dataOldOperatingMechanism.success && dataOldOperatingMechanism.data) {
          entity.oldOperatingMechanism = dataOldOperatingMechanism.data
          if (entity.oldOperatingMechanism.asset_info) {
            const infoRes: any = await getOldOperatingMechanismInfoById(
              entity.oldOperatingMechanism.asset_info
            )
            if (infoRes.success) entity.oldOperatingMechanismInfo = infoRes.data
          }

          if (entity.oldOperatingMechanismInfo) {
            if (entity.oldOperatingMechanismInfo.rated_auxiliary_circuit_voltage) {
              voltageIds.push(entity.oldOperatingMechanismInfo.rated_auxiliary_circuit_voltage)
            }
            if (entity.oldOperatingMechanismInfo.rated_auxiliary_circuit_current) {
              currentFlowIds.push(entity.oldOperatingMechanismInfo.rated_auxiliary_circuit_current)
            }
            if (entity.oldOperatingMechanismInfo.rated_auxiliary_circuit_frequency) {
              frequencyIds.push(entity.oldOperatingMechanismInfo.rated_auxiliary_circuit_frequency)
            }
            if (entity.oldOperatingMechanismInfo.rated_motor_voltage) {
              voltageIds.push(entity.oldOperatingMechanismInfo.rated_motor_voltage)
            }
            if (entity.oldOperatingMechanismInfo.rated_motor_current) {
              currentFlowIds.push(entity.oldOperatingMechanismInfo.rated_motor_current)
            }
            if (entity.oldOperatingMechanismInfo.rated_motor_frequency) {
              frequencyIds.push(entity.oldOperatingMechanismInfo.rated_motor_frequency)
            }
            if (entity.oldOperatingMechanismInfo.rated_operating_pressure) {
              pressureIds.push(entity.oldOperatingMechanismInfo.rated_operating_pressure)
            }
            if (entity.oldOperatingMechanismInfo.rated_operating_pressure_temperature) {
              temperatureIds.push(
                entity.oldOperatingMechanismInfo.rated_operating_pressure_temperature
              )
            }
          }

          if (entity.oldOperatingMechanism.product_asset_model) {
            const modelRes: any = await getProductAssetModelById(
              entity.oldOperatingMechanism.product_asset_model
            )
            if (modelRes.success) entity.operatingProductAssetModel = modelRes.data
          }

          if (entity.oldOperatingMechanism.lifecycle_date) {
            const dateRes: any = await getLifecycleDateById(
              entity.oldOperatingMechanism.lifecycle_date
            )
            if (dateRes.success) entity.operatingLifecycleDate = dateRes.data
          }
          const dataOperatingComponent: any =
            await getOperatingMechanismComponentByOperatingMechanismId(
              entity.oldOperatingMechanism.mrid
            )
          if (dataOperatingComponent.success) {
            entity.operatingMechanismComponent = dataOperatingComponent.data
            for (const component of entity.operatingMechanismComponent) {
              if (component.rated_current) currentFlowIds.push(component.rated_current)
              if (component.rated_voltage) voltageIds.push(component.rated_voltage)
              if (component.rated_frequency) frequencyIds.push(component.rated_frequency)
            }
          }
        }

        voltageIds = voltageIds.filter((id: any) => id)
        currentFlowIds = currentFlowIds.filter((id: any) => id)
        secondIds = secondIds.filter((id: any) => id)
        activePowerIds = activePowerIds.filter((id: any) => id)
        lengthIds = lengthIds.filter((id: any) => id)
        massIds = massIds.filter((id: any) => id)
        volumeIds = volumeIds.filter((id: any) => id)
        pressureIds = pressureIds.filter((id: any) => id)
        quantityIds = quantityIds.filter((id: any) => id)
        frequencyIds = frequencyIds.filter((id: any) => id)
        temperatureIds = temperatureIds.filter((id: any) => id)
        capacitanceIds = capacitanceIds.filter((id: any) => id)
        resistanceIds = resistanceIds.filter((id: any) => id)

        const dataVoltage: any = await getVoltageByIds(voltageIds)
        if (dataVoltage.success) entity.voltage = dataVoltage.data

        const dataCurrentFlow: any = await getCurrentFlowByIds(currentFlowIds)
        if (dataCurrentFlow.success) entity.currentFlow = dataCurrentFlow.data

        const dataSecond: any = await getSecondByIds(secondIds)
        if (dataSecond.success) entity.second = dataSecond.data

        const dataActivePower: any = await getActivePowerByIds(activePowerIds)
        if (dataActivePower.success) entity.activePower = dataActivePower.data

        const dataLength: any = await getLengthByIds(lengthIds)
        if (dataLength.success) entity.length = dataLength.data

        const dataMass: any = await getMassByIds(massIds)
        if (dataMass.success) entity.mass = dataMass.data

        const dataVolume: any = await getVolumeByIds(volumeIds)
        if (dataVolume.success) entity.volume = dataVolume.data

        const dataPressure: any = await getPressureByIds(pressureIds)
        if (dataPressure.success) entity.pressure = dataPressure.data

        const dataQuantity: any = await getQuantityValueByIds(quantityIds)
        if (dataQuantity.success) entity.quantity = dataQuantity.data

        const dataFrequency: any = await getFrequencyByIds(frequencyIds)
        if (dataFrequency.success) entity.frequency = dataFrequency.data

        const dataTemperature: any = await getTemperatureByIds(temperatureIds)
        if (dataTemperature.success) entity.temperature = dataTemperature.data

        const dataCapacitance: any = await getCapacitanceByIds(capacitanceIds)
        if (dataCapacitance.success) entity.capacitance = dataCapacitance.data

        const dataResistance: any = await getResistanceByIds(resistanceIds)
        if (dataResistance.success) entity.resistance = dataResistance.data

        return {
          success: true,
          data: entity,
          message: 'Breaker entity retrieved successfully'
        }
      } else {
        console.warn(
          '[DEBUG] getAssetById FAILED for ID:',
          id,
          dataBreaker.error || 'No data returned'
        )
        return {
          success: false,
          error: dataBreaker.error || new Error('Asset not found in DB'),
          message: `Asset with ID ${id} could not be retrieved. It might be deleted or not properly imported.`
        }
      }
    }
  } catch (error) {
    console.error('[DEBUG] Error retrieving breaker entity by ID (CATCH BLOCK):', error)
    return { success: false, error, message: 'Error retrieving breaker entity by ID' }
  }
}

export const deleteBreakerEntity: any = async (entity: any) => {
  try {
    await runAsync('BEGIN TRANSACTION')
    if (entity.attachment && entity.attachment.id) {
      await deleteAttachmentByIdTransaction(entity.attachment.id, db)
      if (entity.asset && entity.asset.mrid) {
        const dirPath = path.join(attachmentContext.getAttachmentDir(), entity.asset.mrid)
        deleteDirectory(dirPath)
      }
    }

    if (entity.assetPsr && entity.assetPsr.mrid) {
      await deleteAssetPsrTransaction(entity.assetPsr.mrid, db)
    }

    if (entity.assessmentLimitBreakerInfo && entity.assessmentLimitBreakerInfo.mrid) {
      const limitId = entity.assessmentLimitBreakerInfo.mrid

      const crData: any =
        await getContactResistanceBreakerInfoByAssessmentLimitBreakerInfoId(limitId)
      if (crData.success && crData.data && crData.data.length > 0) {
        for (const item of crData.data) {
          await deleteContactResistanceBreakerInfoTransaction(item.mrid, db)
        }
      }

      const otData: any = await getOperatingTimeBreakerInfoByAssessmentLimitBreakerInfoId(limitId)
      if (otData.success && otData.data && otData.data.length > 0) {
        for (const item of otData.data) {
          await deleteOperatingTimeBreakerInfoTransaction(item.mrid, db)
        }
      }

      const ctData: any = await getContactTravelBreakerInfoByAssessmentLimitBreakerInfoId(limitId)
      if (ctData.success && ctData.data && ctData.data.length > 0) {
        for (const item of ctData.data) {
          await deleteContactTravelBreakerInfoTransaction(item.mrid, db)
        }
      }

      const miscData: any = await getMiscellaneousBreakerInfoByAssessmentLimitId(limitId)
      if (miscData.success && miscData.data && miscData.data.length > 0) {
        for (const item of miscData.data) {
          await deleteMiscellaneousBreakerInfoTransaction(item.mrid, db)
        }
      }

      const coilData: any = await getCoilCharacteristicsBreakerInfoByAssessmentLimitId(limitId)
      if (coilData.success && coilData.data && coilData.data.length > 0) {
        for (const item of coilData.data) {
          await deleteCoilCharacteristicsBreakerInfoTransaction(item.mrid, db)
        }
      }

      const pvData: any = await getPickupVoltageBreakerInfoByAssessmentLimitId(limitId)
      if (pvData.success && pvData.data && pvData.data.length > 0) {
        for (const item of pvData.data) {
          await deletePickupVoltageBreakerInfoTransaction(item.mrid, db)
        }
      }

      const mcData: any = await getMotorCharacteristicsBreakerInfoByAssessmentLimitId(limitId)
      if (mcData.success && mcData.data && mcData.data.length > 0) {
        for (const item of mcData.data) {
          await deleteMotorCharacteristicsBreakerInfoTransaction(item.mrid, db)
        }
      }

      const uvData: any = await getUnderVoltageReleaseBreakerInfoByAssessmentLimitId(limitId)
      if (uvData.success && uvData.data && uvData.data.length > 0) {
        for (const item of uvData.data) {
          await deleteUnderVoltageReleaseBreakerInfoTransaction(item.mrid, db)
        }
      }

      const ocData: any = await getOvercurrentReleaseBreakerInfoByAssessmentLimitId(limitId)
      if (ocData.success && ocData.data && ocData.data.length > 0) {
        for (const item of ocData.data) {
          await deleteOvercurrentReleaseBreakerInfoTransaction(item.mrid, db)
        }
      }

      const auxData: any = await getAuxiliaryContactsBreakerInfoByAssessmentLimitId(limitId)
      if (auxData.success && auxData.data) {
        const auxList = Array.isArray(auxData.data) ? auxData.data : [auxData.data]

        for (const auxItem of auxList) {
          const auxId = auxItem.mrid
          const tripData: any = await getTripOperationByAuxiliaryContactsId(auxId)
          if (tripData.success && tripData.data && tripData.data.length > 0) {
            for (const item of tripData.data) {
              await deleteTripOperationTransaction(item.mrid, db)
            }
          }

          const closeData: any = await getCloseOperationByAuxiliaryContactsId(auxId)
          if (closeData.success && closeData.data && closeData.data.length > 0) {
            for (const item of closeData.data) {
              await deleteCloseOperationTransaction(item.mrid, db)
            }
          }

          await deleteAuxiliaryContactsBreakerInfoTransaction(auxId, db)
        }
      }

      try {
        await deleteAssessmentLimitBreakerInfoTransaction(limitId, db)
      } catch (err: any) {
        console.error('[DEBUG] FAILED to delete assessmentLimitBreakerInfo:', err)
        throw new Error('Delete assessmentLimitBreakerInfo failed')
      }
    }

    if (entity.operatingMechanismComponent && entity.operatingMechanismComponent.length > 0) {
      for (const data of entity.operatingMechanismComponent) {
        if (data.mrid) {
          await deleteOperatingMechanismComponentTransaction(data.mrid, db)
        }
      }
    }

    if (entity.oldOperatingMechanism && entity.oldOperatingMechanism.mrid) {
      try {
        await deleteOldOperatingMechanismTransaction(entity.oldOperatingMechanism.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)
        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting oldOperatingMechanism ${entity.oldOperatingMechanism.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          throw err
        }
      }
    }

    if (entity.operatingLifecycleDate && entity.operatingLifecycleDate.mrid) {
      try {
        await deleteLifecycleDateByIdTransaction(entity.operatingLifecycleDate.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)
        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting operatingLifecycleDate ${entity.operatingLifecycleDate.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          throw err
        }
      }
    }

    if (entity.oldOperatingMechanismInfo && entity.oldOperatingMechanismInfo.mrid) {
      try {
        await deleteOldOperatingMechanismInfoTransaction(entity.oldOperatingMechanismInfo.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)
        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting oldOperatingMechanismInfo ${entity.oldOperatingMechanismInfo.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          throw err
        }
      }
    }

    if (entity.operatingProductAssetModel && entity.operatingProductAssetModel.mrid) {
      try {
        await deleteProductAssetModelByIdTransaction(entity.operatingProductAssetModel.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)
        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting operatingProductAssetModel ${entity.operatingProductAssetModel.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          throw err
        }
      }
    }

    if (entity.breakerOtherInfo && entity.breakerOtherInfo.mrid) {
      deleteBreakerOtherInfoTransaction(entity.breakerOtherInfo.mrid, db)
    }

    if (entity.breakerContactSystemInfo && entity.breakerContactSystemInfo.mrid) {
      deleteBreakerContactSystemInfoTransaction(entity.breakerContactSystemInfo.mrid, db)
    }

    if (entity.breakerRatingInfo && entity.breakerRatingInfo.mrid) {
      deleteBreakerRatingInfoTransaction(entity.breakerRatingInfo.mrid, db)
    }

    if (entity.asset && entity.asset.mrid) {
      await deleteAssetByIdTransaction(entity.asset.mrid, db)
    }

    if (entity.lifecycleDate && entity.lifecycleDate.mrid) {
      try {
        await deleteLifecycleDateByIdTransaction(entity.lifecycleDate.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)
        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting lifecycleDate ${entity.lifecycleDate.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          throw err
        }
      }
    }

    if (entity.oldBreakerInfo && entity.oldBreakerInfo.mrid) {
      try {
        await deleteOldBreakerInfoTransaction(entity.oldBreakerInfo.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)

        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting oldBreakerInfo ${entity.oldBreakerInfo.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          console.error(
            '[DEBUG] oldBreakerInfo delete failed with unknown error structure:',
            JSON.stringify(err, null, 2)
          )
          throw err
        }
      }
    }

    if (entity.productAssetModel && entity.productAssetModel.mrid) {
      try {
        await deleteProductAssetModelByIdTransaction(entity.productAssetModel.mrid, db)
      } catch (err: any) {
        const code =
          (err && err.err && err.err.err && err.err.err.code) ||
          (err && err.err && err.err.code) ||
          (err && err.code)
        if (code === 'SQLITE_CONSTRAINT') {
          console.warn(
            `[DEBUG] Skipped deleting productAssetModel ${entity.productAssetModel.mrid} due to foreign key constraint (likely shared).`
          )
        } else {
          throw err
        }
      }
    }

    for (const data of entity.voltage) {
      if (data.mrid) {
        try {
          await deleteVoltageByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting voltage ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.currentFlow) {
      if (data.mrid) {
        try {
          await deleteCurrentFlowByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting currentFlow ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.second) {
      if (data.mrid) {
        try {
          await deleteSecondsByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting second ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.resistance) {
      if (data.mrid) {
        try {
          await deleteResistanceByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting resistance ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.capacitance) {
      if (data.mrid) {
        try {
          await deleteCapacitanceByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting capacitance ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.activePower) {
      if (data.mrid) {
        try {
          await deleteActivePowerByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting activePower ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.length) {
      if (data.mrid) {
        try {
          await deleteLengthByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting length ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.mass) {
      if (data.mrid) {
        try {
          await deleteMassByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting mass ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.volume) {
      if (data.mrid) {
        try {
          await deleteVolumeByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting volume ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.temperature) {
      if (data.mrid) {
        try {
          await deleteTemperatureByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting temperature ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.frequency) {
      if (data.mrid) {
        try {
          await deleteFrequencyByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting frequency ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.quantity) {
      if (data.mrid) {
        try {
          await deleteQuantityValueTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting quantity ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    for (const data of entity.pressure) {
      if (data.mrid) {
        try {
          await deletePressureByIdTransaction(data.mrid, db)
        } catch (err: any) {
          const code =
            (err && err.err && err.err.err && err.err.err.code) ||
            (err && err.err && err.err.code) ||
            (err && err.code)
          if (code === 'SQLITE_CONSTRAINT') {
            console.warn(
              `[DEBUG] Skipped deleting pressure ${data.mrid} due to foreign key constraint.`
            )
          } else {
            throw err
          }
        }
      }
    }

    await runAsync('COMMIT')
    return { success: true, message: 'Breaker entity deleted successfully' }
  } catch (error) {
    await runAsync('ROLLBACK')
    console.error('Error deleting Breaker entity:', error)
    return { success: false, error, message: 'Error deleting Breaker entity' }
  }
}

const insertUnit = async (unit: string, data: any, dbsql: any) => {
  if (unit == 'voltage') {
    await insertVoltageTransaction(data, dbsql)
  } else if (unit == 'currentFlow') {
    await insertCurrentFlowTransaction(data, dbsql)
  } else if (unit == 'second') {
    await insertSecondsTransaction(data, dbsql)
  } else if (unit == 'activePower') {
    await insertActivePowerTransaction(data, dbsql)
  } else if (unit == 'length') {
    await insertLengthTransaction(data, dbsql)
  } else if (unit == 'mass') {
    await insertMassTransaction(data, dbsql)
  } else if (unit == 'volume') {
    await insertVolumeTransaction(data, dbsql)
  } else if (unit == 'temperature') {
    await insertTemperatureTransaction(data, dbsql)
  } else if (unit == 'frequency') {
    await insertFrequencyTransaction(data, dbsql)
  } else if (unit == 'quantity') {
    await insertQuantityValueTransaction(data, dbsql)
  } else if (unit == 'pressure') {
    await insertPressureTransaction(data, dbsql)
  } else if (unit == 'resistance') {
    await insertResistanceTransaction(data, dbsql)
  } else if (unit == 'capacitance') {
    await insertCapacitanceTransaction(data, dbsql)
  }
}

const deleteUnit = async (unit: string, data: any, dbsql: any) => {
  if (unit == 'voltage') {
    await deleteVoltageByIdTransaction(data, dbsql)
  } else if (unit == 'currentFlow') {
    await deleteCurrentFlowByIdTransaction(data, dbsql)
  } else if (unit == 'second') {
    await deleteSecondsByIdTransaction(data, dbsql)
  } else if (unit == 'activePower') {
    await deleteActivePowerByIdTransaction(data, dbsql)
  } else if (unit == 'length') {
    await deleteLengthByIdTransaction(data, dbsql)
  } else if (unit == 'mass') {
    await deleteMassByIdTransaction(data, dbsql)
  } else if (unit == 'volume') {
    await deleteVolumeByIdTransaction(data, dbsql)
  } else if (unit == 'temperature') {
    await deleteTemperatureByIdTransaction(data, dbsql)
  } else if (unit == 'frequency') {
    await deleteFrequencyByIdTransaction(data, dbsql)
  } else if (unit == 'quantity') {
    await deleteQuantityValueTransaction(data, dbsql)
  } else if (unit == 'pressure') {
    await deletePressureByIdTransaction(data, dbsql)
  } else if (unit == 'resistance') {
    await deleteResistanceByIdTransaction(data, dbsql)
  } else if (unit == 'capacitance') {
    await deleteCapacitanceByIdTransaction(data, dbsql)
  }
}

const insertTable = async (table: string, data: any, dbsql: any) => {
  if (table == 'operatingMechanismComponent') {
    await insertOperatingMechanismComponentTransaction(data, dbsql)
  } else if (table == 'contactResistanceBreakerInfo') {
    await insertContactResistanceBreakerInfoTransaction(data, dbsql)
  } else if (table == 'operatingTimeBreakerInfo') {
    await insertOperatingTimeBreakerInfoTransaction(data, dbsql)
  } else if (table == 'contactTravelBreakerInfo') {
    await insertContactTravelBreakerInfoTransaction(data, dbsql)
  } else if (table == 'tripOperation') {
    await insertTripOperationTransaction(data, dbsql)
  } else if (table == 'closeOperation') {
    await insertCloseOperationTransaction(data, dbsql)
  } else if (table == 'miscellaneousBreakerInfo') {
    await insertMiscellaneousBreakerInfoTransaction(data, dbsql)
  } else if (table == 'coilCharacteristicsBreakerInfo') {
    await insertCoilCharacteristicsBreakerInfoTransaction(data, dbsql)
  } else if (table == 'pickupVoltageBreakerInfo') {
    await insertPickupVoltageBreakerInfoTransaction(data, dbsql)
  } else if (table == 'motorCharacteristicsBreakerInfo') {
    await insertMotorCharacteristicsBreakerInfoTransaction(data, dbsql)
  } else if (table == 'underVoltageReleaseBreakerInfo') {
    await insertUnderVoltageReleaseBreakerInfoTransaction(data, dbsql)
  } else if (table == 'overcurrentReleaseBreakerInfo') {
    await insertOvercurrentReleaseBreakerInfoTransaction(data, dbsql)
  }
}

const deleteTable = async (table: string, data: any, dbsql: any) => {
  if (table == 'operatingMechanismComponent') {
    await deleteOperatingMechanismComponentTransaction(data, dbsql)
  } else if (table == 'contactResistanceBreakerInfo') {
    await deleteContactResistanceBreakerInfoTransaction(data, dbsql)
  } else if (table == 'operatingTimeBreakerInfo') {
    await deleteOperatingTimeBreakerInfoTransaction(data, dbsql)
  } else if (table == 'contactTravelBreakerInfo') {
    await deleteContactTravelBreakerInfoTransaction(data, dbsql)
  } else if (table == 'tripOperation') {
    await deleteTripOperationTransaction(data, dbsql)
  } else if (table == 'closeOperation') {
    await deleteCloseOperationTransaction(data, dbsql)
  } else if (table == 'miscellaneousBreakerInfo') {
    await deleteMiscellaneousBreakerInfoTransaction(data, dbsql)
  } else if (table == 'coilCharacteristicsBreakerInfo') {
    await deleteCoilCharacteristicsBreakerInfoTransaction(data, dbsql)
  } else if (table == 'pickupVoltageBreakerInfo') {
    await deletePickupVoltageBreakerInfoTransaction(data, dbsql)
  } else if (table == 'motorCharacteristicsBreakerInfo') {
    await deleteMotorCharacteristicsBreakerInfoTransaction(data, dbsql)
  } else if (table == 'underVoltageReleaseBreakerInfo') {
    await deleteUnderVoltageReleaseBreakerInfoTransaction(data, dbsql)
  } else if (table == 'overcurrentReleaseBreakerInfo') {
    await deleteOvercurrentReleaseBreakerInfoTransaction(data, dbsql)
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
