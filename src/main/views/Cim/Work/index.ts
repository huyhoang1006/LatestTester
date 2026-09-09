import BaseWork from '../BaseWork'

class Work extends BaseWork {
  business_case: any
  erp_project_accounting: any
  project: any
  request_date_time: any
  work_billing_info: any
  work_flow_steps: any
  work_order_number: any
  constructor() {
    super()
    this.request_date_time = null // Work kind
    this.work_order_number = null // Work priority
    this.erp_project_accounting = null // Work status kind
    this.project = null // Work location
    this.work_flow_steps = null // Work location
    this.business_case = null // Work location
    this.work_billing_info = null // Work location
  }
}
export default Work
