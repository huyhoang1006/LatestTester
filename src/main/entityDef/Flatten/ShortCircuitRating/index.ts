class ShortCircuitRating {
    duration_seconds: any
    mrid: any
    power_transformer_info_id: any
    short_circuit_current: any
    constructor() {
        this.mrid = null;
        this.power_transformer_info_id = null; // Reference to the power transformer info
        this.short_circuit_current = null; // Rated short circuit current in kA
        this.duration_seconds = null; // Duration of the short circuit in seconds
    }
}

export default ShortCircuitRating;