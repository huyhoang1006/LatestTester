import AssetInfo from '../AssetInfo'

class SwitchInfo extends AssetInfo {
  breaking_capacity: any
  gas_weight_per_tank: any
  is_single_phase: any
  is_unganged: any
  low_pressure_alarm: any
  low_pressure_lock_out: any
  oil_volume_per_tank: any
  rated_current: any
  rated_frequency: any
  rated_impulse_withstand_voltage: any
  rated_interrupting_time: any
  rated_voltage: any
  constructor() {
    super()
    // FK references
    this.breaking_capacity = null
    this.gas_weight_per_tank = null
    this.oil_volume_per_tank = null
    this.rated_current = null
    this.rated_frequency = null
    this.rated_impulse_withstand_voltage = null
    this.rated_interrupting_time = null
    this.rated_voltage = null

    // Plain fields
    this.is_single_phase = null
    this.is_unganged = null
    this.low_pressure_alarm = null
    this.low_pressure_lock_out = null
  }
}

export default SwitchInfo
