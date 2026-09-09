import * as ipcSubstation from './substation/index'
import * as ipcAttachment from './attachment/index'
import * as ipcParentOrganisation from './parentOrganization/index'
import * as ipcVoltageLevel from './voltageLevel/index'
import * as ipcBay from './bay/index'
import * as ipcSurgeArrester from './surgeArrester/index'
import * as ipcTransformer from './transformer/index'
import * as ipcJob from './job/index'
import * as ipcPowerCable from './powerCable/index'
import * as ipcVoltageTransformer from './VoltageTransformer/index'
import * as ipcBushing from './bushing/index'
import * as ipcDisconnector from './disconnector/index'
import * as ipcRotatingMachine from './rotatingMachine/index'
import * as ipcCurrentTransformer from './currentTransformer/index'
import * as ipcCapacitor from './capacitor/index'
import * as ipcBreaker from './breaker/index'
import * as ipcReactor from './reactor/index'
import * as ipcExport from './export/index'
import * as ipcAssetPsr from './assetPsr/index'
import * as ipcImport from './import/index'
import * as ipcNotification from './notification/index'
import * as ipcUpdate from './update/index'
import * as ipcEntitySnapshot from './entitySnapshot/index'
import * as ipcMRIDCheck from './mRIDCheck/index'
import * as ipcTemplate from './template/index'
import * as ipcOnlineMonitoring from './onlineMonitoring/index'
import * as ipcTestingEquipment from './testingEquipment/index'
import * as ipcAuditLog from './auditLog/index'
import * as ipcCompareTest from './compareTest/index'
import * as ipcSyncState from './syncState/index'
import * as ipcUserIdentifiedObject from './userIdentifiedObject/index'

export const active = (): void => {
  ipcSubstation.active()
  ipcAttachment.active()
  ipcParentOrganisation.active()
  ipcVoltageLevel.active()
  ipcSurgeArrester.active()
  ipcBay.active()
  ipcJob.active()
  ipcTransformer.active()
  ipcPowerCable.active()
  ipcVoltageTransformer.active()
  ipcBushing.active()
  ipcDisconnector.active()
  ipcRotatingMachine.active()
  ipcCurrentTransformer.active()
  ipcCapacitor.active()
  ipcBreaker.active()
  ipcReactor.active()
  ipcExport.active()
  ipcAssetPsr.active()
  ipcImport.active()
  ipcNotification.active()
  ipcUpdate.active()
  ipcEntitySnapshot.active()
  ipcMRIDCheck.active()
  ipcTemplate.active()
  ipcOnlineMonitoring.active()
  ipcTestingEquipment.active()
  ipcAuditLog.active()
  ipcCompareTest.active()
  ipcSyncState.active()
  ipcUserIdentifiedObject.active()
}
