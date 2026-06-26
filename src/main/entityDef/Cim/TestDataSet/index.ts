import ProcedureDataSet from "../ProcedureDataSet";

class TestDataSet extends ProcedureDataSet {
    conclusion: any
    specimen_id: any
    specimen_to_lab_date_time: any
    constructor() {
        super();
        this.conclusion = null; // Test ID
        this.specimen_id = null; // Test Name
        this.specimen_to_lab_date_time = null; // Test Description
    }
}
export default TestDataSet;
