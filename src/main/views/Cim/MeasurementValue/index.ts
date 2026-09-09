import IOPoint from '../IOPoint'

class MeasurementValue extends IOPoint {
  calculation_method_hierarchy: any
  erp_person: any
  measurement_value_source: any
  sensor_accuracy: any
  time_stamp: any
  constructor() {
    super()
    this.sensor_accuracy = null
    this.time_stamp = null
    this.measurement_value_source = null
    this.calculation_method_hierarchy = null
    this.erp_person = null
  }
}

export default MeasurementValue
