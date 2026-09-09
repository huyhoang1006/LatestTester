import Asset from '@/views/Cim/Asset'
import ProductAssetModel from '@/views/Cim/ProductAssetModel'
import LifecycleDate from '@/views/Cim/LifecycleDate'
import InUseDate from '@/views/Cim/InUseDate'
import TestingEquipmentInfo from '@/views/Flatten/TestingEquipmentInfo'
import Attachment from '@/views/Flatten/Attachment'
import UserIdentifiedObject from '@/views/Flatten/UserIdentifiedObject'

// Entity tổng hợp toàn bộ thông tin của 1 testing equipment.
// Khớp shape mà insertTestingEquipmentEntity / getTestingEquipmentEntity dùng:
//   { asset, testingEquipment, softwareLicenses[], calibrations[], repairs[], accessories[] }
// Các mảng chứa item theo shape: SoftwareLicense / CalibrationRecord / RepairRecord / AccessoryTestingEquipment
class TestingEquipmentEntity {
  constructor() {
    this.asset = new Asset() // Cim/Asset (asset.mrid === testingEquipment.mrid)
    this.productAssetModel = new ProductAssetModel() // manufacturer / model_number
    this.lifecycleDate = new LifecycleDate() // manufactured_date
    this.inUseDate = new InUseDate() // in_use_date
    this.testingEquipment = new TestingEquipmentInfo()
    this.attachment = new Attachment() // 1 record, path = JSON [{path}]
    this.userIdentifiedObject = new UserIdentifiedObject() // link user <-> thiết bị

    this.softwareLicenses = [] // [ SoftwareLicense ]
    this.calibrations = [] // [ CalibrationRecord ]
    this.repairs = [] // [ RepairRecord ] (activity_record type='Repair')
    this.accessories = [] // [ AccessoryTestingEquipment ]
  }
}

export default TestingEquipmentEntity
