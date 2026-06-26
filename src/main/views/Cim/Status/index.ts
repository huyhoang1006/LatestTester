class Status {
    date_time: any
    mrid: any
    reason: any
    remark: any
    value: any
    constructor() {
        this.mrid = null;
        this.date_time = null; // e.g., "active", "inactive"
        this.reason = null;
        this.remark = null; // optional description of the status
        this.value = null; // e.g., "operational", "maintenance", "fault"
    }
}

export default Status;
