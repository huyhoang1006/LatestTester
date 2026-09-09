import IdentifiedObject from '../IdentifiedObject'
class OrganisationRole extends IdentifiedObject {
  organisation: any
  constructor() {
    super()
    this.organisation = null
  }
}

export default OrganisationRole
