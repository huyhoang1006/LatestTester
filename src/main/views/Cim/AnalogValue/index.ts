import MeasurementValue from '../MeasurementValue'

class AnalogValue extends MeasurementValue {
  analog: any
  value: any
  constructor() {
    super()
    this.value = null
    this.analog = null
  }
}

export default AnalogValue
