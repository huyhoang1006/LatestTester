import AssetInfo from '../AssetInfo'

class ReactorInfo extends AssetInfo {
  inductance: any
  insulation_type: any
  rated_current: any
  rated_frequency: any
  rated_power: any
  rated_voltage: any
  constructor() {
    super()
    this.rated_voltage = null
    this.rated_current = null
    this.rated_frequency = null
    this.rated_power = null
    this.inductance = null
    this.insulation_type = null
  }
}

export default ReactorInfo
