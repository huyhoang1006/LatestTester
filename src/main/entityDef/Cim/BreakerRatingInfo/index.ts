class BreakerRatingInfo {
  breaker_info_id: any
  interrupting_duty_cycle: any
  mrid: any
  rated_insulation_level: any
  rated_power_closing: any
  rated_power_motor_charge: any
  rated_power_opening: any
  rated_short_circuit_breaking_current: any
  short_circuit_nominal_duration: any
  constructor() {
    this.mrid = null
    this.breaker_info_id = null
    this.rated_short_circuit_breaking_current = null
    this.short_circuit_nominal_duration = null
    this.rated_insulation_level = null
    this.interrupting_duty_cycle = null
    this.rated_power_closing = null
    this.rated_power_opening = null
    this.rated_power_motor_charge = null
  }
}

export default BreakerRatingInfo
