import AssetInfo from '../AssetInfo'
class WireInfo extends AssetInfo {
  core_radius: any
  core_strand_count: any
  gmr: any
  insulated: any
  insulation_material: any
  insulation_thickness: any
  material: any
  r_ac: any
  r_dc: any
  radius: any
  rated_current: any
  size_description: any
  strand_count: any
  constructor() {
    super()
    this.core_radius = null // Length: bán kính lõi
    this.core_strand_count = null // Integer: số sợi trong lõi
    this.gmr = null // Length: geometric mean radius
    this.insulated = null // Boolean: có cách điện không
    this.insulation_material = null // WireInsulationKind
    this.insulation_thickness = null // Length: độ dày cách điện
    this.material = null // WireMaterialKind
    this.r_ac = null // ResistancePerLength: điện trở AC/đơn vị
    this.radius = null // Length: bán kính ngoài
    this.rated_current = null // CurrentFlow: dòng định mức
    this.r_dc = null // ResistancePerLength: điện trở DC/đơn vị
    this.size_description = null // String: mô tả kích thước
    this.strand_count = null // Integer: số sợi dẫn
  }
}

export default WireInfo
