import { importBushing as importBushingFromFile } from './Bushing'
import { importTransformer as importTransformerFromFile } from './Transformer'
import { importVoltageTransformer as importVoltageTransformerFromFile } from './VoltageTransformer'
import { importCurrentTransformer as importCurrentTransformerFromFile } from './CurrentTransformer'
import { importBreaker as importBreakerFromFile } from './Breaker'
import { importReactor as importReactorFromFile } from './Reactor'
import { importCapacitor as importCapacitorFromFile } from './Capacitor'
import { importRotatingMachine as importRotatingMachineFromFile } from './RotatingMachine'
import { importDisconnector as importDisconnectorFromFile } from './Disconnector'
import { importPowerCable as importPowerCableFromFile } from './PowerCable'
import { importSurgeArrester as importSurgeArresterFromFile } from './SurgeArrester'
import { importBay as importBayFromFile } from './Bay'
import { importVoltageLevel as importVoltageLevelFromFile } from './VoltageLevel'
import { importSubstation as importSubstationFromFile } from './Substation'
import { importOrganisation as importOrganisationFromFile } from './Organisation'

export const importNodeFromJSON: any = async (dtos: any[], parentNode: any, dependencies: any) => {
  const { electronAPI, mappings, messageHandler } = dependencies || {}

  try {
    if (!Array.isArray(dtos) || dtos.length === 0) {
      messageHandler?.warning?.('No data found to import')
      return { success: false, message: 'No data found to import' }
    }

    let successCount = 0
    let errorCount = 0
    const errors: any[] = []
    const importedNodes: any[] = []

    const importMap: any = {
      organisation: (dto: any) =>
        importOrganisationFromFile(dto, parentNode, { electronAPI, mappings }),
      substation: (dto: any) =>
        importSubstationFromFile(dto, parentNode, { electronAPI, mappings }),
      voltageLevel: (dto: any) =>
        importVoltageLevelFromFile(dto, parentNode, { electronAPI, mappings }),
      bay: (dto: any) => importBayFromFile(dto, parentNode, { electronAPI }),

      surgeArrester: (dto: any) =>
        importSurgeArresterFromFile(dto, parentNode, { electronAPI, mappings }),
      powerCable: (dto: any) =>
        importPowerCableFromFile(dto, parentNode, { electronAPI, mappings }),
      disconnector: (dto: any) =>
        importDisconnectorFromFile(dto, parentNode, { electronAPI, mappings }),
      rotatingMachine: (dto: any) =>
        importRotatingMachineFromFile(dto, parentNode, { electronAPI, mappings }),
      capacitor: (dto: any) => importCapacitorFromFile(dto, parentNode, { electronAPI, mappings }),
      voltageTransformer: (dto: any) =>
        importVoltageTransformerFromFile(dto, parentNode, { electronAPI, mappings }),
      currentTransformer: (dto: any) =>
        importCurrentTransformerFromFile(dto, parentNode, { electronAPI, mappings }),
      transformer: (dto: any) =>
        importTransformerFromFile(dto, parentNode, { electronAPI, mappings }),
      breaker: (dto: any) => importBreakerFromFile(dto, parentNode, { electronAPI, mappings }),
      reactor: (dto: any) => importReactorFromFile(dto, parentNode, { electronAPI, mappings }),
      bushing: (dto: any) => importBushingFromFile(dto, parentNode, { electronAPI, mappings })
    }

    const typeDisplayMap: any = {
      rotatingMachine: 'Rotating machine',
      disconnector: 'Disconnector',
      voltageTransformer: 'Voltage transformer',
      currentTransformer: 'Current transformer',
      powerCable: 'Power cable',
      capacitor: 'Capacitor',
      transformer: 'Transformer',
      breaker: 'Circuit breaker',
      reactor: 'Reactor',
      bushing: 'Bushing',
      surgeArrester: 'Surge arrester',
      bay: 'Bay',
      voltageLevel: 'Voltage level',
      substation: 'Substation',
      organisation: 'Organisation'
    }

    for (const dtoItem of dtos) {
      try {
        const { type, data: dto } = dtoItem || {}

        if (!type || !dto) {
          errorCount++
          errors.push('Invalid DTO format: missing type or data')
          continue
        }

        const handler = importMap[type]

        if (!handler) {
          errorCount++
          errors.push(`Unknown type: ${type}`)
          continue
        }

        const result: any = await handler(dto)

        if (result?.success) {
          successCount++

          const ent = result.entity || result.data

          if (ent?.asset?.mrid && parentNode?.mrid) {
            const nodeToAdd = {
              mrid: ent.asset.mrid,
              name: ent.asset.name || null,
              serial_number: ent.asset.serial_number || null,
              parentId: parentNode.mrid,
              parentName: parentNode.name || null,
              parentArr: parentNode.parentArr || [],
              mode: 'asset',
              asset: typeDisplayMap[type] || type
            }
            importedNodes.push(nodeToAdd)
          } else if (ent?.voltageLevel?.mrid && parentNode?.mrid) {
            importedNodes.push({
              mrid: ent.voltageLevel.mrid,
              name: ent.voltageLevel.name || null,
              parentId: parentNode.mrid,
              parentName: parentNode.name || null,
              parentArr: parentNode.parentArr || [],
              mode: 'voltageLevel'
            })
          } else if (ent?.substation?.mrid && parentNode?.mrid) {
            importedNodes.push({
              mrid: ent.substation.mrid,
              name: ent.substation.name || null,
              parentId: parentNode.mrid,
              parentName: parentNode.name || null,
              parentArr: parentNode.parentArr || [],
              mode: 'substation'
            })
          } else if (ent?.bay?.mrid && parentNode?.mrid) {
            importedNodes.push({
              mrid: ent.bay.mrid,
              name: ent.bay.name || null,
              parentId: parentNode.mrid,
              parentName: parentNode.name || null,
              parentArr: parentNode.parentArr || [],
              mode: 'bay'
            })
          } else if (ent?.organisation?.mrid && parentNode?.mrid) {
            importedNodes.push({
              mrid: ent.organisation.mrid,
              name: ent.organisation.name || null,
              parentId: parentNode.mrid,
              parentName: parentNode.name || null,
              parentArr: parentNode.parentArr || [],
              mode: 'organisation'
            })
          }
        } else {
          errorCount++
          errors.push(`${type}: ${result?.message || 'Import failed'}`)
        }
      } catch (err: any) {
        errorCount++
        errors.push(`Error importing ${dtoItem?.type}: ${err?.message}`)
        console.error(`Error importing ${dtoItem?.type}:`, err)
      }
    }

    const message =
      `Imported ${successCount} item(s) successfully` +
      (errorCount > 0 ? `, ${errorCount} failed` : '')

    if (messageHandler) {
      if (errorCount === 0) messageHandler.success?.(message)
      else if (successCount > 0) messageHandler.warning?.(message)
      else messageHandler.error?.(`Import failed: ${errors.join('; ')}`)
    }

    return {
      success: successCount > 0,
      message,
      successCount,
      errorCount,
      errors,
      importedNodes
    }
  } catch (error: any) {
    console.error('Error importing nodes from JSON:', error)
    messageHandler?.error?.('An error occurred while importing nodes from JSON')
    return { success: false, message: error?.message || 'Import failed' }
  }
}
