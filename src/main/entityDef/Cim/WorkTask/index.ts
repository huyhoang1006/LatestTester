import BaseWork from "../BaseWork";
class WorkTask extends BaseWork {
    completed_date_time: any
    contractor_cost: any
    crew_eta: any
    instruction: any
    estimated_completion_time: any
    sched_override: any
    started_date_time: any
    task_kind: any
    tool_cost: any
    trouble_order: any
    switching_plan: any
    work: any

    constructor() {
        super();
        this.completed_date_time = null; // Task ID
        this.contractor_cost = null; // Task Name
        this.crew_eta = null; // Assigned To
        this.instruction = null; // Due Date
        this.estimated_completion_time = null; // Status
        this.sched_override = null; // Status
        this.started_date_time = null; // Status
        this.task_kind = null; // Status
        this.tool_cost = null; // Status
        this.trouble_order = null; // Status
        this.switching_plan = null; // Status
        this.work = null; // Status
    }
}
export default WorkTask;
