import ActivityRecord from '../ActivityRecord'

class ConfigurationEvent extends ActivityRecord {
  changed_asset: any
  changed_attachment: any
  changed_location: any
  changed_organisation: any
  changed_organisation_role: any
  changed_person: any
  changed_person_role: any
  effective_date_time: any
  modified_by: any
  power_system_resource: any
  remark: any
  user_name: any
  constructor() {
    super()
    this.effective_date_time = null // EventType
    this.remark = null // DateTime
    this.power_system_resource = null // String
    this.changed_location = null // IdentifiedObject
    this.changed_asset = null // String
    this.changed_organisation_role = null // IdentifiedObject
    this.changed_organisation = null // String
    this.changed_person_role = null // String
    this.changed_person = null // IdentifiedObject
    this.changed_attachment = null // String
    this.modified_by = null // String
    this.user_name = null // String
  }
}

export default ConfigurationEvent
