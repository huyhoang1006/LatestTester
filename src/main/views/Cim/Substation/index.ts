import EquipmentContainer from '../EquipmentContainer'

class Substation extends EquipmentContainer {
  generation: any
  industry: any
  constructor() {
    super()
    this.generation = null
    this.industry = null
  }
}
export default Substation
