import IdentifiedObject from '../IdentifiedObject'

class Organisation extends IdentifiedObject {
  electronic_address: any
  parent_organisation: any
  phone: any
  postal_address: any
  street_address: any
  tax_code: any
  constructor() {
    super()
    this.electronic_address = null
    this.phone = null
    this.postal_address = null
    this.street_address = null
    this.tax_code = null
    this.parent_organisation = null
  }
}
export default Organisation
