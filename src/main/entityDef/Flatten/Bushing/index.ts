import Bushing from '@/views/Cim/Bushing'
import OldBushingInfo from '@/views/Cim/OldBushingInfo'
import Attachment from '../Attachment'
import LifecycleDate from '@/views/Cim/LifecycleDate'
import AssetPsr from '@/views/Flatten/AssetPsr'
import ProductAssetModel from '@/views/Cim/ProductAssetModel'
class BushingAssetEntity {
  assetPsr: any
  attachment: any
  bushing: any
  capacitance: any
  currentFlow: any
  frequency: any
  lifecycleDate: any
  oldBushingInfo: any
  percent: any
  productAssetModel: any
  voltage: any
  constructor() {
    this.bushing = new Bushing()
    this.oldBushingInfo = new OldBushingInfo()
    this.lifecycleDate = new LifecycleDate()
    this.productAssetModel = new ProductAssetModel()
    this.assetPsr = new AssetPsr()
    this.attachment = new Attachment()
    this.frequency = []
    this.voltage = []
    this.currentFlow = []
    this.percent = []
    this.capacitance = []
  }
}

export default BushingAssetEntity
