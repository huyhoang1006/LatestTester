class VoltageRating {
  insulation_c: any
  insulation_u: any
  mrid: any
  rated_ln: any
  rated_u: any
  regulation: any
  transformer_end_id: any
  constructor() {
    this.mrid = null
    this.rated_u = null
    this.rated_ln = null
    this.insulation_u = null
    this.insulation_c = null
    this.regulation = null
    this.transformer_end_id = null
  }
}

export default VoltageRating
