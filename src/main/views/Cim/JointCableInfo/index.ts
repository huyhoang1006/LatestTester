class JointCableInfo {
    cable_info_id: any
    category: any
    construction: any
    mrid: any
    rated_current: any
    rated_u: any
    service_condition: any
    constructor() {
        this.mrid = null;
        this.rated_u = null;
        this.rated_current = null;
        this.category = null;
        this.construction = null;
        this.service_condition = null;
        this.cable_info_id = null;
    }
}

export default JointCableInfo;