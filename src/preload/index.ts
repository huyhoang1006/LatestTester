import { contextBridge, ipcRenderer } from 'electron'

import { userPreload } from './userPreload'
import { appOptionPreload } from './appOptionPreload'
import { uploadCustomPreload } from './uploadCustomPreload'
import {
  attachmentPreload,
  substationEntityPreload,
  parentOrganizationEntityPreload,
  voltageLevelEntityPreload,
  bayEntityPreload,
  surgeArresterEntityPreload,
  transformerEntityPreload,
  powerCableEntityPreload,
  voltageTransformerEntityPreload,
  bushingEntityPreload,
  disconnectorEntityPreload,
  rotatingMachineEntityPreload,
  currentTransformerEntityPreload,
  capacitorEntityPreload,
  breakerEntityPreload,
  reactorEntityPreload,
  assetPsrPreload,
  notificationEntityPreload,
  updateEntityPreload,
  entitySnapshotPreload,
  importPreload,
  exportPreload,
  jobEntityPreload,
  testingEquipmentEntityPreload,
  auditLogPreload,
  compareTestPreload,
  syncStatePreload,
  userIdentifiedObjectPreload
} from './entity'
import {
  substationPreload,
  locationPreload,
  parentOrganizationPreload,
  voltageLevelPreload,
  bayPreload,
  personPreload,
  assetPreload,
  analogPreload,
  procedurePreload,
  licensePreload,
  oldWorkPreload,
  powerSystemResourcePreload,
  productAssetModelPreload,
  bushingPreload,
  powerCablePreload,
  surgeArresterPreload,
  personRolePreload,
  positionPointPreload,
  streetDetailPreload,
  streetAddressPreload,
  townDetailPreload,
  electronicAddressPreload,
  telephoneNumberPreload,
  configurationEventPreload,
  stringMeasurementPreload,
  discretePreload,
  valueToAliasPreload,
  valueAliasSetPreload,
  baseVoltagePreload,
  voltagePreload
} from './cim'

const windowControlAPI = {
  onWindowStateChange: (callback: (value: boolean) => void) => {
    ipcRenderer.on('window-state-change', (_event, value) => callback(value))
  }
}

const fileConverterAPI = {
  convertFiles: (filePaths: string[], fileType: string) =>
    ipcRenderer.invoke('convert-files', filePaths, fileType)
}

const authAPI = {
  authRequest: (config: {
    url: string
    data: string
    headers: Record<string, string>
    timeout?: number
  }) => ipcRenderer.invoke('auth:request', config)
}

const apiProxyAPI = {
  apiRequest: (config: {
    method?: string
    url: string
    headers?: Record<string, string>
    data?: unknown
    params?: unknown
    timeout?: number
  }) => ipcRenderer.invoke('api:request', config)
}

const systemInfoAPI = {
  platform: process.platform
}

const ipcMain = Object.assign(
  {},
  windowControlAPI,
  fileConverterAPI,
  authAPI,
  apiProxyAPI,
  systemInfoAPI,
  appOptionPreload(),
  uploadCustomPreload(),
  attachmentPreload(),
  substationEntityPreload(),
  parentOrganizationEntityPreload(),
  voltageLevelEntityPreload(),
  bayEntityPreload(),
  surgeArresterEntityPreload(),
  transformerEntityPreload(),
  powerCableEntityPreload(),
  voltageTransformerEntityPreload(),
  bushingEntityPreload(),
  disconnectorEntityPreload(),
  rotatingMachineEntityPreload(),
  currentTransformerEntityPreload(),
  capacitorEntityPreload(),
  breakerEntityPreload(),
  reactorEntityPreload(),
  assetPsrPreload(),
  notificationEntityPreload(),
  updateEntityPreload(),
  entitySnapshotPreload(),
  importPreload(),
  exportPreload(),
  jobEntityPreload.circuitBreakerJob(),
  jobEntityPreload.transformerJob(),
  jobEntityPreload.surgeArresterJob(),
  jobEntityPreload.powerCableJob(),
  jobEntityPreload.currentTransformerJob(),
  jobEntityPreload.voltageTransformerJob(),
  jobEntityPreload.bushingJob(),
  jobEntityPreload.disconnectorJob(),
  jobEntityPreload.rotatingMachineJob(),
  jobEntityPreload.capacitorJob(),
  jobEntityPreload.reactorJob(),
  substationPreload(),
  locationPreload(),
  parentOrganizationPreload(),
  voltageLevelPreload(),
  bayPreload(),
  personPreload(),
  assetPreload(),
  analogPreload(),
  procedurePreload(),
  licensePreload(),
  oldWorkPreload(),
  powerSystemResourcePreload(),
  productAssetModelPreload(),
  bushingPreload(),
  powerCablePreload(),
  surgeArresterPreload(),
  personRolePreload(),
  positionPointPreload(),
  streetDetailPreload(),
  streetAddressPreload(),
  townDetailPreload(),
  electronicAddressPreload(),
  telephoneNumberPreload(),
  configurationEventPreload(),
  stringMeasurementPreload(),
  discretePreload(),
  valueToAliasPreload(),
  valueAliasSetPreload(),
  baseVoltagePreload(),
  voltagePreload(),
  userPreload(),
  testingEquipmentEntityPreload(),
  auditLogPreload(),
  compareTestPreload(),
  syncStatePreload(),
  userIdentifiedObjectPreload(),
  {
    uploadAttachment: (id_foreign: string, type: string, info: unknown) =>
      ipcRenderer.invoke('uploadAttachment', id_foreign, type, info),
    updateAttachment: (id: string, info: unknown, type: string) =>
      ipcRenderer.invoke('updateAttachment', id, info, type),
    getAllAttachment: (id_foreign: string, type: string) =>
      ipcRenderer.invoke('getAllAttachment', id_foreign, type),
    deleteAttachment: (id_foreign: string) => ipcRenderer.invoke('deleteAttachment', id_foreign),
    deleteAttachmentpath: (name: string) => ipcRenderer.invoke('deleteAttachmentpath', name),
    updateOnlineMonitoringData: (online_monitoring: Record<string, unknown>) =>
      ipcRenderer.invoke('updateOnlineMonitoringData', online_monitoring),
    deleteMonitorsByAssetId: (assetId: string) =>
      ipcRenderer.invoke('deleteMonitorsByAssetId', assetId),
    getOnlineMonitoringData: (assetId: string) =>
      ipcRenderer.invoke('getOnlineMonitoringData', assetId),
    insertOnlineMonitoringData: (assetId: string, online_monitoring: Record<string, unknown>) =>
      ipcRenderer.invoke('insertOnlineMonitoringData', assetId, online_monitoring),
    exportSubstation: (substationId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportSubstation', substationId, user_id, organisation_id),
    exportVoltageLevel: (voltageLevelId: string, user_id: string) =>
      ipcRenderer.invoke('exportVoltageLevel', voltageLevelId, user_id),
    exportBay: (bayId: string, user_id: string) => ipcRenderer.invoke('exportBay', bayId, user_id),
    exportTransformer: (transformerId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportTransformer', transformerId, user_id, organisation_id),
    exportCircuitBreaker: (breakerId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportCircuitBreaker', breakerId, user_id, organisation_id),
    exportSurgeArrester: (surgeId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportSurgeArrester', surgeId, user_id, organisation_id),
    exportPowerCable: (cableId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportPowerCable', cableId, user_id, organisation_id),
    exportVoltageTransformer: (transformerId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportVoltageTransformer', transformerId, user_id, organisation_id),
    exportCurrentTransformer: (transformerId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportCurrentTransformer', transformerId, user_id, organisation_id),
    exportBushing: (bushingId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportBushing', bushingId, user_id, organisation_id),
    exportDisconnector: (disconnectorId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportDisconnector', disconnectorId, user_id, organisation_id),
    exportRotatingMachine: (machineId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportRotatingMachine', machineId, user_id, organisation_id),
    exportCapacitor: (capacitorId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportCapacitor', capacitorId, user_id, organisation_id),
    exportReactor: (reactorId: string, user_id: string, organisation_id: string) =>
      ipcRenderer.invoke('exportReactor', reactorId, user_id, organisation_id),
    importSubstation: (filePath: string) => ipcRenderer.invoke('importSubstation', filePath),
    importVoltageLevel: (filePath: string) => ipcRenderer.invoke('importVoltageLevel', filePath),
    importBay: (filePath: string) => ipcRenderer.invoke('importBay', filePath),
    importTransformer: (filePath: string) => ipcRenderer.invoke('importTransformer', filePath),
    importCircuitBreaker: (filePath: string) =>
      ipcRenderer.invoke('importCircuitBreaker', filePath),
    importSurgeArrester: (filePath: string) => ipcRenderer.invoke('importSurgeArrester', filePath),
    importPowerCable: (filePath: string) => ipcRenderer.invoke('importPowerCable', filePath),
    importVoltageTransformer: (filePath: string) =>
      ipcRenderer.invoke('importVoltageTransformer', filePath),
    importCurrentTransformer: (filePath: string) =>
      ipcRenderer.invoke('importCurrentTransformer', filePath),
    importBushing: (filePath: string) => ipcRenderer.invoke('importBushing', filePath),
    importDisconnector: (filePath: string) => ipcRenderer.invoke('importDisconnector', filePath),
    importRotatingMachine: (filePath: string) =>
      ipcRenderer.invoke('importRotatingMachine', filePath),
    importCapacitor: (filePath: string) => ipcRenderer.invoke('importCapacitor', filePath),
    importReactor: (filePath: string) => ipcRenderer.invoke('importReactor', filePath),
    getAllSubstation: () => ipcRenderer.invoke('getAllSubstation'),
    getSubstationByOrganisation: (organisationId: string) =>
      ipcRenderer.invoke('getSubstationByOrganisation', organisationId),
    getLocationBySubstation: (substationId: string) =>
      ipcRenderer.invoke('getLocationBySubstation', substationId),
    getAllVoltageLevel: () => ipcRenderer.invoke('getAllVoltageLevel'),
    getVoltageLevelBySubstation: (substationId: string) =>
      ipcRenderer.invoke('getVoltageLevelBySubstation', substationId),
    getBayByVoltageLevel: (voltageLevelId: string) =>
      ipcRenderer.invoke('getBayByVoltageLevel', voltageLevelId),
    insertAsset: (data: unknown) => ipcRenderer.invoke('insertAsset', data),
    deleteAsset: (mrid: string) => ipcRenderer.invoke('deleteAsset', mrid),
    updateSubstation: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateSubstation', mrid, data),
    deleteSubstation: (mrid: string) => ipcRenderer.invoke('deleteSubstation', mrid),
    updateLocation: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateLocation', mrid, data),
    deleteLocation: (mrid: string) => ipcRenderer.invoke('deleteLocation', mrid),
    updateVoltageLevel: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateVoltageLevel', mrid, data),
    deleteVoltageLevel: (mrid: string) => ipcRenderer.invoke('deleteVoltageLevel', mrid),
    updateBay: (mrid: string, data: unknown) => ipcRenderer.invoke('updateBay', mrid, data),
    deleteBay: (mrid: string) => ipcRenderer.invoke('deleteBay', mrid),
    updateAsset: (mrid: string, data: unknown) => ipcRenderer.invoke('updateAsset', mrid, data),
    updateAnalog: (mrid: string, data: unknown) => ipcRenderer.invoke('updateAnalog', mrid, data),
    deleteAnalogByMrid: (mrid: string) => ipcRenderer.invoke('deleteAnalogByMrid', mrid),
    updateProcedure: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateProcedure', mrid, data),
    deleteProcedure: (mrid: string) => ipcRenderer.invoke('deleteProcedure', mrid),
    insertLicense: (data: unknown) => ipcRenderer.invoke('insertLicense', data),
    updateLicense: (mrid: string, data: unknown) => ipcRenderer.invoke('updateLicense', mrid, data),
    deleteLicense: (mrid: string) => ipcRenderer.invoke('deleteLicense', mrid),
    updatePerson: (mrid: string, data: unknown) => ipcRenderer.invoke('updatePerson', mrid, data),
    deletePersonByMrid: (mrid: string) => ipcRenderer.invoke('deletePersonByMrid', mrid),
    updateConfigurationEventByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateConfigurationEventByMrid', mrid, data),
    deleteConfigurationEventByMrid: (mrid: string) =>
      ipcRenderer.invoke('deleteConfigurationEventByMrid', mrid),
    updatePowerSystemResourceByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updatePowerSystemResourceByMrid', mrid, data),
    deletePowerSystemResourceByMrid: (mrid: string) =>
      ipcRenderer.invoke('deletePowerSystemResourceByMrid', mrid),
    updateProductAssetModelByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateProductAssetModelByMrid', mrid, data),
    deleteProductAssetModelByMrid: (mrid: string) =>
      ipcRenderer.invoke('deleteProductAssetModelByMrid', mrid),
    updatePowerCableByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updatePowerCableByMrid', mrid, data),
    deletePowerCableByMrid: (mrid: string) => ipcRenderer.invoke('deletePowerCableByMrid', mrid),
    insertPowerSystemResource: (data: unknown) =>
      ipcRenderer.invoke('insertPowerSystemResource', data),
    insertProductAssetModel: (data: unknown) => ipcRenderer.invoke('insertProductAssetModel', data),
    insertPowerCable: (data: unknown) => ipcRenderer.invoke('insertPowerCable', data),
    insertStreetAddress: (data: unknown) => ipcRenderer.invoke('insertStreetAddress', data),
    updateStreetAddressByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateStreetAddressByMrid', mrid, data),
    deleteStreetAddressByMrid: (mrid: string) =>
      ipcRenderer.invoke('deleteStreetAddressByMrid', mrid),
    getLocationByOrganisationId: (organisationId: string) =>
      ipcRenderer.invoke('getLocationByOrganisationId', organisationId),
    getLocationDetailByMrid: (mrid: string) => ipcRenderer.invoke('getLocationDetailByMrid', mrid),
    getAllAnalogByProcedure: (procedureId: string) =>
      ipcRenderer.invoke('getAllAnalogByProcedure', procedureId),
    getPersonByOrganisationId: (organisationId: string) =>
      ipcRenderer.invoke('getPersonByOrganisationId', organisationId),
    updateLicenseLimit: (name: string, limit: number) =>
      ipcRenderer.invoke('updateLicenseLimit', name, limit),
    insertBay: (data: unknown) => ipcRenderer.invoke('insertBay', data),
    updateSubstationByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateSubstationByMrid', mrid, data),
    deleteSubstationByMrid: (mrid: string) => ipcRenderer.invoke('deleteSubstationByMrid', mrid),
    updateLocationByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateLocationByMrid', mrid, data),
    deleteLocationByMrid: (mrid: string) => ipcRenderer.invoke('deleteLocationByMrid', mrid),
    updateVoltageLevelByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateVoltageLevelByMrid', mrid, data),
    deleteVoltageLevelByMrid: (mrid: string) =>
      ipcRenderer.invoke('deleteVoltageLevelByMrid', mrid),
    updateBayByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateBayByMrid', mrid, data),
    deleteBayByMrid: (mrid: string) => ipcRenderer.invoke('deleteBayByMrid', mrid),
    updatePersonByMrid: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updatePersonByMrid', mrid, data),
    getProcedureByGenericAssetModel: (generic_asset_model: string) =>
      ipcRenderer.invoke('getProcedureByGenericAssetModel', generic_asset_model),
    getAssetPsrByAssetIdAndPsrId: (assetId: string, psrId: string) =>
      ipcRenderer.invoke('getAssetPsrByAssetIdAndPsrId', assetId, psrId),
    getAssetPsrById: (mrid: string) => ipcRenderer.invoke('getAssetPsrById', mrid),
    updateAssetPsr: (mrid: string, data: unknown) =>
      ipcRenderer.invoke('updateAssetPsr', mrid, data),
    deleteAssetPsrById: (mrid: string) => ipcRenderer.invoke('deleteAssetPsrById', mrid),
    getBayEntityByMrid: (mrid: string) => ipcRenderer.invoke('getBayEntityByMrid', mrid),
    insertBayEntity: (data: unknown) => ipcRenderer.invoke('insertBayEntity', data),
    deleteBayEntityByMrid: (data: unknown) => ipcRenderer.invoke('deleteBayEntityByMrid', data),
    insertVoltageLevelEntity: (data: unknown) =>
      ipcRenderer.invoke('insertVoltageLevelEntity', data),
    getVoltageLevelEntityByMrid: (mrid: string) =>
      ipcRenderer.invoke('getVoltageLevelEntityByMrid', mrid),
    deleteVoltageLevelEntityByMrid: (data: unknown) =>
      ipcRenderer.invoke('deleteVoltageLevelEntityByMrid', data),
    insertParentOrganizationEntity: (data: unknown) =>
      ipcRenderer.invoke('insertParentOrganizationEntity', data),
    insertParentOrganizationEntityFromServer: (data: unknown, serverData: unknown) =>
      ipcRenderer.invoke('insertParentOrganizationEntityFromServer', data, serverData),
    deleteParentOrganizationEntity: (data: unknown) =>
      ipcRenderer.invoke('deleteParentOrganizationEntity', data),
    getEntitySnapshotByMrid: (mrid: string, type: string) =>
      ipcRenderer.invoke('getEntitySnapshotByMrid', mrid, type),
    insertEntitySnapshot: (data: unknown) => ipcRenderer.invoke('insertEntitySnapshot', data),
    deleteEntitySnapshotByMrid: (mrid: string) =>
      ipcRenderer.invoke('deleteEntitySnapshotByMrid', mrid),
    getBushingByPsrId: (mrid: string) => ipcRenderer.invoke('getBushingByPsrId', mrid),
    getPowerCableByPsrId: (mrid: string) => ipcRenderer.invoke('getPowerCableByPsrId', mrid),
    getValueAliasSetByMrids: (mrids: string[]) =>
      ipcRenderer.invoke('getValueAliasSetByMrids', mrids),
    getValueAliasSetAndValueToAliasByMrid: (mrid: string) =>
      ipcRenderer.invoke('getValueAliasSetAndValueToAliasByMrid', mrid),
    getBaseVoltageByMrid: (mrid: string) => ipcRenderer.invoke('getBaseVoltageByMrid', mrid),
    getVoltageByMrid: (mrid: string) => ipcRenderer.invoke('getVoltageByMrid', mrid),
    updateCircuitAssessmentLimits: (asset: unknown) =>
      ipcRenderer.invoke('updateCircuitAssessmentLimits', asset),
    convertFileToJSON: (filePath: string) => ipcRenderer.invoke('convertFileToJSON', filePath)
  }
)

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', ipcMain)
  } catch (error) {
    console.error(error)
  }
} else {
  ;(window as unknown as { electronAPI: typeof ipcMain }).electronAPI = ipcMain
}
