import IdentifiedObject from '../IdentifiedObject'

class TransformerObservation extends IdentifiedObject {
  bushing_temp: any
  dga: any
  freq_resp: any
  furfural_dp: any
  hot_spot_temp: any
  oil_color: any
  oil_dielectric_strength: any
  oil_ift: any
  oil_level: any
  oil_neutralization_number: any
  pump_vibration: any
  reconditioning: any
  status: any
  top_oil_temp: any
  transformer: any
  water_content: any
  constructor() {
    super()
    this.bushing_temp = null
    this.dga = null
    this.freq_resp = null
    this.furfural_dp = null
    this.hot_spot_temp = null
    this.oil_color = null
    this.oil_dielectric_strength = null
    this.oil_ift = null
    this.oil_level = null
    this.oil_neutralization_number = null
    this.pump_vibration = null
    this.status = null
    this.top_oil_temp = null
    this.water_content = null
    this.transformer = null
    this.reconditioning = null // e.g., "active", "inactive"
  }
}

export default TransformerObservation
