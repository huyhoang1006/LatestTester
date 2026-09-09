class ValueWithUnit {
  mrid: any
  multiplier: any
  unit: any
  value: any
  constructor(mrid = null, value = null, multiplier = null, unit = null) {
    this.mrid = mrid
    this.value = value
    this.multiplier = multiplier
    this.unit = unit
  }
}

export default ValueWithUnit
