import PotentialTransformerInfo from "../PotentialTransformerInfo";

class OldPotentialTransformerInfo extends PotentialTransformerInfo {
    c1: any
    c2: any
    rated_frequency: any
    standard: any
    upr_formula: any
    windings: any
    constructor() {
        super();
        this.standard = null;                      // TEXT
        this.rated_frequency = null;    // FK -> frequency(mrid)
        this.upr_formula = null;                   // TEXT
        this.windings = null;
        this.c1 = null;
        this.c2 = null;
    }
}
export default OldPotentialTransformerInfo;