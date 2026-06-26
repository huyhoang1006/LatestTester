import OldSwitchInfo from '../OldSwitchInfo'

class DisconnectorInfo extends OldSwitchInfo {
    power_frequency_isolating_distance: any
    rated_duration_short_circuit: any
    withstand_voltage_earth_poles: any
    constructor() {
        super()
        this.rated_duration_short_circuit = null
        this.withstand_voltage_earth_poles = null
        this.power_frequency_isolating_distance = null
    }
}

export default DisconnectorInfo
