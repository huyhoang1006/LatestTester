import Asset from '@/views/Cim/Asset'
import OldTapChangerInfo from '@/views/Cim/OldTapChangerInfo'
import productAssetModel from '@/views/Cim/ProductAssetModel'
class TapChangerEntity {
  asset: any
  oldTapChangerInfo: any
  productAssetModel: any
  tapChangerTablePoint: any
  voltage: any
  constructor() {
    this.asset = new Asset()
    this.productAssetModel = new productAssetModel()
    this.oldTapChangerInfo = new OldTapChangerInfo()
    this.tapChangerTablePoint = []
    this.voltage = []
  }
}

export default TapChangerEntity
