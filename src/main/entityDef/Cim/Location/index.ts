import IdentifiedObject from '../IdentifiedObject'

class Location extends IdentifiedObject {
  direction: any
  electronic_address: any
  geo_info_reference: any
  main_address: any
  phone: any
  secondary_address: any
  status: any
  type: any
  constructor() {
    super()
    this.direction = null
    this.electronic_address = null
    this.geo_info_reference = null
    this.main_address = null
    this.phone = null
    this.secondary_address = null
    this.status = null
    this.type = null
  }
}

export default Location
