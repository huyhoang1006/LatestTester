/* eslint-disable */
import { getSurgeArresterById } from '@/api/demo/index.js'
import * as SurgeArresterServerMapper from '@/views/Mapping/ServerToDTO/SurgeArrester/index.js'
import * as SurgeArresterMapper from '@/views/Mapping/SurgeArrester/index.js'
import SurgeArresterEntity from '@/views/Flatten/SurgeArrester/index.js'
import { fetchWithRetry } from './core-utils.js'

// SurgeArrester không có conflict dialog vì tableRating là array phức tạp
// Server wins nếu client rỗng, giữ client nếu đã có data

export async function getSurgeArresterChain(id, parentId) {
  try {
    const data = await fetchWithRetry(() => getSurgeArresterById(id))
    return {
      surgeArrester: {
        id: id,
        mrid: String(id),
        name: data?.assetInfo?.apparatusId || '',
        parentId: String(parentId),
        _type: 'asset',
        asset: 'Surge arrester',
        _serverData: data || {}
      },
      _type: 'asset',
      asset: 'Surge arrester',
      parentBayId: String(parentId)
    }
  } catch (error) {
    console.error(`Error fetching surgeArrester with id ${id}:`, error)
    throw new Error(`Error fetching surgeArrester with id ${id}: ${error.message}`)
  }
}

export async function downloadSurgeArresterChain(data, ctx) {
  const sa = data.surgeArrester
  const serverData = { ...sa._serverData, mRID: sa.mrid }

  const serverDto = SurgeArresterServerMapper.mapServerToDto(serverData)
  serverDto.psrId = data.parentBayId
  serverDto.properties.mrid = sa.mrid

  const existingResult = await window.electronAPI.getSurgeArresterEntityByMrid(
    sa.mrid,
    data.parentBayId
  )
  const clientEntity = existingResult.success ? existingResult.data : null
  const clientDto = clientEntity ? SurgeArresterMapper.surgeArresterEntityToDto(clientEntity) : null

  let mergedDto

  if (!clientDto) {
    mergedDto = serverDto
  } else {
    mergedDto = { ...clientDto }

    const propsToMerge = [
      'serial_no',
      'manufacturer',
      'manufacturer_type',
      'manufacturer_year',
      'country_of_origin',
      'apparatus_id',
      'comment'
    ]
    for (const key of propsToMerge) {
      if (!clientDto.properties[key] && serverDto.properties[key]) {
        mergedDto.properties = { ...mergedDto.properties }
        mergedDto.properties[key] = serverDto.properties[key]
      }
    }

    const clientRatings = clientDto.ratings?.tableRating || []
    mergedDto.ratings = { ...clientDto.ratings }
    mergedDto.ratings.tableRating = serverDto.ratings.tableRating.map((serverRow) => {
      const clientRow = clientRatings.find((r) => r.position === serverRow.position)
      if (!clientRow) return serverRow

      return {
        ...serverRow,
        mrid: clientRow.mrid || serverRow.mrid,
        assetInfoId: clientRow.assetInfoId || serverRow.assetInfoId,
        serial: clientRow.serial || serverRow.serial,
        ratedVoltage: {
          ...serverRow.ratedVoltage,
          mrid: clientRow.ratedVoltage?.mrid || serverRow.ratedVoltage.mrid
        },
        maximumVoltage: {
          ...serverRow.maximumVoltage,
          mrid: clientRow.maximumVoltage?.mrid || serverRow.maximumVoltage.mrid
        },
        continousVoltage: {
          ...serverRow.continousVoltage,
          mrid: clientRow.continousVoltage?.mrid || serverRow.continousVoltage.mrid
        },
        shortCurrent: {
          ...serverRow.shortCurrent,
          mrid: clientRow.shortCurrent?.mrid || serverRow.shortCurrent.mrid
        },
        ratedCircuit: {
          ...serverRow.ratedCircuit,
          mrid: clientRow.ratedCircuit?.mrid || serverRow.ratedCircuit.mrid
        },
        polesVoltage: {
          ...serverRow.polesVoltage,
          mrid: clientRow.polesVoltage?.mrid || serverRow.polesVoltage.mrid
        },
        isoVoltage: {
          ...serverRow.isoVoltage,
          mrid: clientRow.isoVoltage?.mrid || serverRow.isoVoltage.mrid
        }
      }
    })
    mergedDto.ratings.unitStack = serverDto.ratings.unitStack

    mergedDto.assetInfoId = clientDto.assetInfoId || serverDto.assetInfoId
    mergedDto.productAssetModelId = clientDto.productAssetModelId || serverDto.productAssetModelId
    mergedDto.lifecycleDateId = clientDto.lifecycleDateId || serverDto.lifecycleDateId
    mergedDto.assetPsrId = clientDto.assetPsrId || serverDto.assetPsrId
    mergedDto.locationId = clientDto.locationId || serverDto.locationId
  }

  mergedDto.properties.mrid = sa.mrid
  mergedDto.psrId = data.parentBayId

  const oldEntity = clientEntity || new SurgeArresterEntity()
  const newEntity = SurgeArresterMapper.surgeArresterDtoToEntity(mergedDto)
  const insertResult = await fetchWithRetry(() =>
    window.electronAPI.insertSurgeArresterEntity(oldEntity, newEntity, serverDto)
  )
  if (!insertResult.success)
    throw new Error(`Database Insert SurgeArrester Error: ${insertResult.message}`)
}
