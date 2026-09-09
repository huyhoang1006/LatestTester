import SurgeArresterInfo from '../SurgeArresterInfo'

class OldSurgeArresterInfo extends SurgeArresterInfo {
  maximum_system_voltage: any
  pf_with_stand_voltage_earth_between_pole: any
  pf_with_stand_voltage_isolated_distance: any
  phase: any
  rated_duration_of_short_circuit: any
  short_time_with_stand_current: any
  transformer_end_info: any
  voltage_ll: any
  voltage_ln: any
  constructor() {
    super()
    this.maximum_system_voltage = null
    this.short_time_with_stand_current = null
    this.rated_duration_of_short_circuit = null
    this.pf_with_stand_voltage_earth_between_pole = null
    this.pf_with_stand_voltage_isolated_distance = null
    this.voltage_ll = null
    this.voltage_ln = null
    this.phase = null
    this.transformer_end_info = null
  }
}

export default OldSurgeArresterInfo
