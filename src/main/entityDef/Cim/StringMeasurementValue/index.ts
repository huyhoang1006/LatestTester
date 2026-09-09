import MeasurementValue from '@/views/Cim/MeasurementValue'
class StringMeasurementValue extends MeasurementValue {
  string_measurement: any
  value: any
  constructor() {
    super()
    this.value = null
    this.string_measurement = null
  }
}

export default StringMeasurementValue
