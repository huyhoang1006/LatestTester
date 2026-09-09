import CableInfo from '../CableInfo'

class ConcentricNeutralCableInfo extends CableInfo {
  diameter_over_neutral: any
  neutral_strand_count: any
  neutral_strand_gmr: any
  neutral_strand_radius: any
  neutral_strand_rdc: any
  constructor() {
    super()
    this.diameter_over_neutral = null
    this.neutral_strand_count = null
    this.neutral_strand_gmr = null
    this.neutral_strand_radius = null
    this.neutral_strand_rdc = null
  }
}

export default ConcentricNeutralCableInfo
