
class TerminalCableInfo {
    bil: any
    bsl: any
    cable_info_id: any
    class: any
    connector_type: any
    mrid: any
    rated_u: any
    service_condition: any
    type: any
    constructor() {
        this.mrid = null;            // String (unique)
        this.rated_u = null;          // Voltage (FK -> voltage.mrid)
        this.bil = null;              // Voltage (FK -> voltage.mrid)
        this.bsl = null;              // Frequency (FK -> frequency.mrid)
        this.type = null;             // String (cable type)
        this.connector_type = null;   // String (connector type)
        this.service_condition = null;// String (service condition)
        this.cable_info_id = null;    // CableInfo (FK -> cable_info.mrid)
        this.class = null;            // String (class)
    }
}

export default TerminalCableInfo;
