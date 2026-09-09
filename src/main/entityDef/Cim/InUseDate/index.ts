class InUseDate {
  in_use_date: any
  mrid: any
  not_ready_for_use_date: any
  ready_for_use_date: any
  constructor() {
    this.mrid = null
    this.in_use_date = null
    this.not_ready_for_use_date = null // e.g., "commissioning", "decommissioning"
    this.ready_for_use_date = null // optional description of the lifecycle event
  }
}

export default InUseDate
