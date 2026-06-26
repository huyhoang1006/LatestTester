class SurgeArresterWorkTask extends WorkTask {
    test_standard_id: any
    test_type_surge_arrester_id: any
    constructor() {
        super();
        this.test_type_surge_arrester_id = null; // Surge Arrester Type
        this.test_standard_id = null; // Surge Arrester Standard
    }
}
export default SurgeArresterWorkTask;
