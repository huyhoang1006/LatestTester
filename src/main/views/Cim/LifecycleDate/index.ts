class LifecycleDate {
    installation_date: any
    manufactured_date: any
    mrid: any
    purchase_date: any
    received_date: any
    removal_date: any
    retired_date: any
    constructor() {
        this.mrid = null;
        this.installation_date = null;
        this.manufactured_date = null; // e.g., "commissioning", "decommissioning"
        this.purchase_date = null; // optional description of the lifecycle event
        this.received_date = null;
        this.removal_date = null;
        this.retired_date = null;
    }
}

export default LifecycleDate;