import IdentifiedObject from '../IdentifiedObject'

class PowerSystemResource extends IdentifiedObject {
  location: any
  psr_type_id: any
  constructor() {
    super()
    this.psr_type_id = null
    this.location = null
  }
}
export default PowerSystemResource
