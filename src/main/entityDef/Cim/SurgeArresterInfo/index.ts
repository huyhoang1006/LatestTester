import AssetInfo from '../AssetInfo'

class SurgeArresterInfo extends AssetInfo {
  continuous_operating_voltage: any
  is_polymer: any
  lightning_impulse_discharge_voltage: any
  line_discharge_class: any
  nominal_discharge_current: any
  pressure_relief_class: any
  rated_voltage: any
  steep_front_discharge_voltage: any
  switching_impulse_discharge_voltage: any
  constructor() {
    super()
    this.continuous_operating_voltage = null
    this.is_polymer = null
    this.lightning_impulse_discharge_voltage = null
    this.line_discharge_class = null
    this.nominal_discharge_current = null
    this.pressure_relief_class = null
    this.rated_voltage = null
    this.steep_front_discharge_voltage = null
    this.switching_impulse_discharge_voltage = null
  }
}

export default SurgeArresterInfo
