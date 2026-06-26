import Measurement from "@/views/Cim/Measurement";
class Analog extends Measurement {
    max_value: any
    min_value: any
    normal_value: any
    positive_flow_in: any
    constructor() {
        super();
        this.max_value = null;
        this.min_value = null;
        this.normal_value = null; // Normal value of the analog measurement
        this.positive_flow_in = null; // Current value of the analog measurement
    }
}

export default Analog;
