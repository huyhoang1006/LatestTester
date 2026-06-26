import BushingInfo from '../BushingInfo';
class OldBushingInfo extends BushingInfo {
    c2_capacitance: any
    c2_power_factor: any
    high_voltage_limit: any
    phase: any
    rated_frequency: any
    transformer_end_info: any
    constructor() {
        super();
        this.high_voltage_limit = null;
        this.c2_capacitance = null;
        this.c2_power_factor = null;
        this.rated_frequency = null
        this.transformer_end_info = null
        this.phase = null
    }
}

export default OldBushingInfo;
