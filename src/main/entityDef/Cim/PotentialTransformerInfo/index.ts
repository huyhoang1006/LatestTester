import AssetInfo from "../AssetInfo";

class PotentialTransformerInfo extends AssetInfo {
    accuracy_class: any
    nominal_ratio: any
    primary_ratio: any
    pt_class: any
    rated_voltage: any
    secondary_ratio: any
    tertiary_ratio: any
    constructor() {
        super();
        this.accuracy_class = null;        // TEXT
        this.nominal_ratio = null;  // FK -> ratio(mrid)
        this.primary_ratio = null;  // FK -> ratio(mrid)
        this.pt_class = null;              // TEXT
        this.rated_voltage = null; // FK -> voltage(mrid)
        this.secondary_ratio = null; // FK -> ratio(mrid)
        this.tertiary_ratio = null;  // FK -> ratio(mrid)
    }
}
export default PotentialTransformerInfo;