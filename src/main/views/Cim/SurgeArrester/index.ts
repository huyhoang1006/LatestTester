import Asset from "../Asset";

class SurgeArrester extends Asset {
    apparatus_id: any
    asset_id: any
    asset_system_code: any
    manufacturer_type: any
    unit_count: any
    constructor() {
        super();
        this.unit_count = null;
        this.manufacturer_type = null;
        this.apparatus_id = null;
        this.asset_system_code = null;
        this.asset_id = null;
    }
}

export default SurgeArrester;