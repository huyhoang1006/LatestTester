import IdentifiedObject from '../IdentifiedObject'
class CoolingPowerRating extends IdentifiedObject {
  cooling_kind: any
  power_rating: any
  power_transformer_info_id: any
  stage: any
  temp_rise_wind: any
  constructor() {
    super()
    this.power_rating = null // Power rating of the cooling system
    this.stage = null // Stage of the cooling system
    this.cooling_kind = null // Type of cooling system (e.g., air, water)
    this.temp_rise_wind = null // Temperature rating of the cooling system
    this.power_transformer_info_id = null
  }
}
export default CoolingPowerRating
