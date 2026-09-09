import IdentifiedObject from '../IdentifiedObject'
class ProductAssetModel extends IdentifiedObject {
  catalogue_number: any
  corporate_standard_kind: any
  drawing_number: any
  instruction_manual: any
  manufacturer: any
  model_number: any
  model_version: any
  overall_length: any
  style_number: any
  weight_total: any
  constructor() {
    super()
    this.catalogue_number = null
    this.manufacturer = null
    this.corporate_standard_kind = null // e.g., "standard", "custom"
    this.drawing_number = null // Version of the corporate standard
    this.instruction_manual = null // Type of equipment (e.g., transformer, switch)
    this.model_number = null // Name of the product asset model
    this.model_version = null // Unique identifier for the product asset model
    this.overall_length = null // Overall length of the product asset model
    this.style_number = null // Style number of the product asset model
    this.weight_total = null // Type of the product asset model (e.g., electrical, mechanical)
    this.manufacturer = null // Manufacturer of the product asset model
  }
}

export default ProductAssetModel
