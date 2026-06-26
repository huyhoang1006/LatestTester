import LifecycleDate from "@/views/Cim/LifecycleDate";
import ProductAssetModel from "@/views/Cim/ProductAssetModel";
import AssetPsr from "@/views/Cim/AssetPsr";
import Attachment from '@/views/Flatten/Attachment';
import Asset from "@/views/Cim/Asset";
import AssetInfo from "@/views/Cim/AssetInfo";
import OldCurrentTransformerInfo from "@/views/Cim/OldCurrentTransformerInfo";

class CurrentTransformerEntity {
    apparentPower: any
    asset: any
    assetInfo: any
    assetPsr: any
    attachment: any
    CtCoreInfo: any
    CtTapInfo: any
    currentFlow: any
    frequency: any
    lifecycleDate: any
    oldCurrentTransformerInfo: any
    percent: any
    productAssetModel: any
    resistance: any
    seconds: any
    temperature: any
    voltage: any
    constructor() {
        this.lifecycleDate = new LifecycleDate()
        this.productAssetModel = new ProductAssetModel();
        this.assetPsr = new AssetPsr();
        this.attachment = new Attachment();
        this.asset = new Asset()
        this.assetInfo = new AssetInfo()
        this.oldCurrentTransformerInfo = new OldCurrentTransformerInfo()
        this.CtCoreInfo = []
        this.CtTapInfo = []       
        this.voltage = []
        this.currentFlow = []
        this.seconds = []
        this.frequency = []
        this.resistance = []
        this.percent = []
        this.apparentPower = []
        this.temperature = []
    }
}

export default CurrentTransformerEntity;