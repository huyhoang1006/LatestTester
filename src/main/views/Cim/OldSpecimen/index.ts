import Specimen from "../Specimen";

class OldSpecimen extends Specimen {
    reference_temp: any
    weather_kind: any
    winding_temp: any
    work_task_id: any
    constructor() {
        super();
        this.weather_kind = null; // e.g., "active", "inactive"
        this.reference_temp = null; // optional description of the status
        this.winding_temp = null; // e.g., "operational", "maintenance", "fault"
        this.work_task_id = null; // reference to the associated work task
    }
}

export default OldSpecimen;
