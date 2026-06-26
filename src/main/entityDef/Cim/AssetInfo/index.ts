import IdentifiedObject from "../IdentifiedObject";
class AssetInfo extends IdentifiedObject {
    manufacturer_type: any
    product_asset_model: any
    constructor() {
        super();
        this.manufacturer_type = null; // Year of manufacture
        this.product_asset_model = null;
    }
}

export default AssetInfo;