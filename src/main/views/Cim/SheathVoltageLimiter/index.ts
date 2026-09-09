class SheathVoltageLimiter {
  cable_info_id: any
  high_current_impulse_withstand: any
  long_duration_current_impulse_withstand: any
  max_continuous_operating_voltage: any
  mrid: any
  nominal_discharge_current: any
  rated_voltage_ur: any
  short_circuit_withstand: any
  constructor() {
    this.mrid = null // String (unique)
    this.rated_voltage_ur = null // Voltage (FK -> voltage.mrid)
    this.max_continuous_operating_voltage = null // Voltage (FK -> voltage.mrid)
    this.nominal_discharge_current = null // Frequency (FK -> frequency.mrid)
    this.high_current_impulse_withstand = null // String/Number (depends on DB schema)
    this.long_duration_current_impulse_withstand = null // String/Number
    this.short_circuit_withstand = null // String/Number
    this.cable_info_id = null // CableInfo (FK -> cable_info.mrid)
  }
}

export default SheathVoltageLimiter
