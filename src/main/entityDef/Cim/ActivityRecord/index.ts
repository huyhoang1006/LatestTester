import IdentifiedObject from "../IdentifiedObject";

class ActivityRecord extends IdentifiedObject {
    created_date_time: any
    reason: any
    severity: any
    status: any
    type: any
    constructor() {
        super();
        this.status = null; // ActivityType
        this.created_date_time = null; // DateTime
        this.reason = null; // String
        this.severity = null; // IdentifiedObject
        this.type = null; // ActivityType
    }
    
}
export default ActivityRecord;